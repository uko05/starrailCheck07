import { starrailChars, starrailVersions } from 'https://cdn.jsdelivr.net/gh/uko05/99_SharedImage@main/02_Starrail/chara_data/starrail_chars.js';
import { submitVotes } from './checkSheetVotes.js';
// firebaseConfig.jsを先に評価してデフォルトAppを確立してからsaved-image.jsをimportすること
// (順序が逆だとログイン状態が正しく共有されない。saved-image.jsのコメント参照)。
import { db } from './firebaseConfig.js';
import { doc, runTransaction, increment } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
  onAccountAuthState, saveProfileImage, getSavedProfileImage, formatSavedAt,
} from 'https://uko05.github.io/24_AccountCenter/saved-image.js';

// ===== ユーザーID(uko05.github.io配下の全サイト共通のlocalStorageキー) =====
const LS_USER_ID = 'genshinOmikuji_userId';
function getSharedUserId() {
  let id = localStorage.getItem(LS_USER_ID);
  if (!id) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    id = 'u_' + Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(LS_USER_ID, id);
  }
  return id;
}

const imageFolder = 'https://cdn.jsdelivr.net/gh/uko05/99_SharedImage@main/02_Starrail/chara_full/';
const versionFolder = 'https://cdn.jsdelivr.net/gh/uko05/99_SharedImage@main/02_Starrail/version/';
const imageData = [
    ...starrailChars.map(c => ({ src: c.icon, category: 'chara' })),
    ...starrailVersions.map(v => ({ src: v, category: 'version' })),
];

const MAX_SELECTION = 1;
const SELECTED_LABEL = '☑';
const SITE_ID = 'starrailCheck';
let refreshSavedImageUI = () => {};

// ===== 「画像を1回生成する」ミッション(アカウント登録者限定・生涯1回・+20UP) =====
const MISSION_CLAIM_KEY = 'starrailCheckImage';
let missionLoggedInUser = null;
onAccountAuthState((user) => {
  missionLoggedInUser = user;
  if (user) markImageGenerationMissionAchievedIfAlreadySaved();
});

function showMissionToast(text) {
  let toast = document.getElementById('uko-mission-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'uko-mission-toast';
    toast.className = 'uko-mission-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.remove('show');
  void toast.offsetWidth; // reflow
  toast.classList.add('show');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

async function markMissionAchievedOnce() {
  const userId = getSharedUserId();
  const ref = doc(db, 'omikujiUsers', userId);
  try {
    const achieved = await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      const data = snap.exists() ? snap.data() : {};
      // 既に達成フラグ済み、または(旧仕様の名残で)受け取り済みなら何もしない
      if (data.missionsAchieved?.[MISSION_CLAIM_KEY] || data.missionsClaimed?.[MISSION_CLAIM_KEY]) return false;
      tx.set(ref, {
        missionsAchieved: { [MISSION_CLAIM_KEY]: true },
      }, { merge: true });
      return true;
    });
    if (achieved) {
      const lang = savedImageLang();
      showMissionToast(lang === 'en' ? 'Mission complete! Claim it on the UPoint page.' : 'ミッション達成！うーこポイント交換所で受け取ろう');
    }
  } catch (e) {
    console.error('[mission] mark achieved failed', e);
  }
}

// 画像生成が成功した時に呼ぶ。未ログインなら静かに何もしない。
function markImageGenerationMissionAchieved() {
  if (!missionLoggedInUser) return;
  markMissionAchievedOnce();
}

// 既にログイン前から画像を保存済みだった人を、ログイン検知時に遡って達成扱いにする
async function markImageGenerationMissionAchievedIfAlreadySaved() {
  try {
    const entry = await getSavedProfileImage(SITE_ID);
    if (entry) await markMissionAchievedOnce();
  } catch (e) {
    console.error('[mission] backfill check failed', e);
  }
}

function savedImageLang() {
  return document.querySelector('input[name="lang"]:checked')?.value || localStorage.getItem('lang') || 'ja';
}

const SAVED_IMAGE_NOT_LOGGED_IN_HTML = {
  ja: 'アカウント登録すると、ここで前回保存した画像を確認できます。<a href="https://uko05.github.io/24_AccountCenter/" target="_blank" rel="noopener">登録はこちら（任意）</a>',
  en: 'Register an account to see your last saved image here. <a href="https://uko05.github.io/24_AccountCenter/" target="_blank" rel="noopener">Register here (optional)</a>',
};
const SAVED_IMAGE_NO_HISTORY_HTML = {
  ja: '画像を保存すると、ここに表示されます。',
  en: 'Once you save an image, it will appear here.',
};

// 「前回保存した画像を確認」トグルの初期化。
// 未登録者にも常に表示し(登録を後押しするため)、状態に応じてメッセージ/画像を切り替える。
function initSavedImageUI() {
  const toggle = document.getElementById('uko-saved-image-toggle');
  const panel = document.getElementById('uko-saved-image-panel');
  const messageEl = document.getElementById('uko-saved-image-message');
  const dateEl = document.getElementById('uko-saved-image-date');
  const imgEl = document.getElementById('uko-saved-image-img');
  const modal = document.getElementById('uko-saved-image-modal');
  const modalImg = document.getElementById('uko-saved-image-modal-img');
  const modalClose = document.getElementById('uko-saved-image-modal-close');
  const arrowEl = document.getElementById('uko-saved-image-arrow');
  if (!toggle || !panel || !messageEl || !dateEl || !imgEl) return;

  toggle.addEventListener('click', () => {
    const willOpen = panel.style.display === 'none';
    panel.style.display = willOpen ? 'block' : 'none';
    if (arrowEl) arrowEl.textContent = willOpen ? '▲' : '▼';
  });

  // サムネイルは元画像の30%サイズで表示する
  imgEl.addEventListener('load', () => {
    imgEl.style.width = `${imgEl.naturalWidth * 0.3}px`;
  });
  // クリックで原寸(100%)ポップアップ表示
  imgEl.addEventListener('click', () => {
    if (!modal || !modalImg) return;
    modalImg.src = imgEl.src;
    modal.style.display = 'flex';
  });
  modalClose?.addEventListener('click', () => { modal.style.display = 'none'; });
  modal?.querySelector('.uko-saved-image-modal-backdrop')?.addEventListener('click', () => { modal.style.display = 'none'; });

  let loggedIn = false;

  function showMessage(html) {
    messageEl.innerHTML = html;
    messageEl.style.display = 'block';
    dateEl.style.display = 'none';
    imgEl.style.display = 'none';
  }

  async function refresh() {
    if (!loggedIn) {
      showMessage(SAVED_IMAGE_NOT_LOGGED_IN_HTML[savedImageLang()]);
      return;
    }
    const entry = await getSavedProfileImage(SITE_ID);
    if (entry) {
      messageEl.style.display = 'none';
      dateEl.style.display = 'block';
      imgEl.style.display = 'block';
      dateEl.textContent = formatSavedAt(entry.updatedAt);
      imgEl.src = entry.url;
    } else {
      showMessage(SAVED_IMAGE_NO_HISTORY_HTML[savedImageLang()]);
    }
  }
  refreshSavedImageUI = refresh;
  onAccountAuthState((user) => { loggedIn = !!user; refresh(); });
  document.querySelectorAll('input[name="lang"]').forEach((el) => el.addEventListener('change', refresh));
}

// タブごとの選択状態を管理するためのオブジェクト
const tabSelections = {};

const i18n = {
  ja: {
    default: "デフォルト",
    hakai: "左バー消滅",
    title: "#スタレチェックシート",
    savedImageToggle: "前回保存した画像を確認",
    username: "ユーザー名:",
    q1: "Q1.始めた時期は？",
    q2: "Q2.好きなバージョンは？",
    q3: "Q3.推しキャラは？",
    q4: "Q4.髪型が似てるキャラは？",
    q5: "Q5.親友にするなら？",
    q6: "Q6.兄妹にするなら？",
    q7: "Q7.結婚するなら？",
    q8: "Q8.同じ声になれるなら？",
    q9: "Q9.１日入れ替わるなら？",
    q10: "Q10.着てみたい<br>キャラの服装は？",
    q11: "Q11.最初に引いた星５は？<br>(恒常除く)",
    q12: "Q12.一番欲しいキャラは？",
  },
  en: {
    default: "Default",
    hakai: "Hide Left Bar",
    title: "#StarRail Check Sheet",
    savedImageToggle: "Check last saved image",
    username: "Name:",
    q1:  "Q1.When did you start?",
    q2:  "Q2.Favorite version?",
    q3:  "Q3.Favorite character?",
    q4:  "Q4.Similar hairstyle?",
    q5:  "Q5.Best friend?",
    q6:  "Q6.As a sibling?",
    q7:  "Q7.Who would you marry?",
    q8:  "Q8.Whose voice?",
    q9:  "Q9.One-day body swap?",
    q10: "Q10.Outfit you’d wear?",
    q11: "Q11.First limited 5★?",
    q12: "Q12.Most wanted character?"

  }
};

// ===== i18n適用 =====
function applyLang(lang) {
  const dict = i18n[lang] || i18n.ja;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const val = dict[key];
    if (val == null) return;

    // <br> を含むときだけHTMLとして反映
    if (typeof val === "string" && val.includes("<br>")) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });

  localStorage.setItem("lang", lang);
}

// ラジオボタンの監視
function initLangSwitch() {
  const saved = localStorage.getItem("lang") || "ja";
  const radio = document.querySelector(`input[name="lang"][value="${saved}"]`);
  if (radio) radio.checked = true;

  // 初期適用
  applyLang(saved);

  // change適用（全ラジオに付与）
  document.querySelectorAll('input[name="lang"]').forEach(r => {
    r.addEventListener("change", (e) => {
      applyLang(e.target.value);
    });
  });
}

//------------------------------------------------------------------------------------------------

function loadImages() {
    const tabs = document.querySelectorAll('.tab-label');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabKey   = tab.getAttribute('for');   // ← 追加: タブ固有キー
        const category = tab.dataset.category;      // ← 表示カテゴリ（共通でOK）

        if (tab.classList.contains('active')) return;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        tabContents.forEach(content => {
          if (content.previousElementSibling === tab) {
            const listEl = content.querySelector('.image-list');
            updateImageList(category, listEl, tabKey);
            restoreSelectionState(tabKey, category, listEl);
          }
        });
      });
    });

    tabs[0].click(); // 初期表示
  
    function updateImageList(category, container, tabKey) {
      container.innerHTML = '';
      const filtered = imageData.filter(img => img.category === category);

      filtered.forEach(imgData => {
        const wrap = document.createElement('div');
        wrap.classList.add('image-container');

        const img = document.createElement('img');
        img.src = `${imgData.category === 'version' ? versionFolder : imageFolder}${imgData.src}`;
        img.dataset.src = imgData.src;
        img.dataset.category = imgData.category;
        img.classList.add('image-item');
        img.addEventListener('click', () => handleImageClick(img, tabKey, container));

        wrap.appendChild(img);
        container.appendChild(wrap);
      });
    }
    
    function setSaveImage(tabKey, src, category) {
      // 該当する保存枠を探す
      const entry = document.querySelector(`#savearea .entry[data-key="${tabKey}"]`);
      if (!entry) return;

      const img = entry.querySelector('.imgheight img');
      if (!img) return;

      if (src) {
        img.src = `${category === 'version' ? versionFolder : imageFolder}${src}`;  // フォルダ＋ファイル名
        img.alt = src;
        img.dataset.src = src;
      } else {
        // 解除時は空にする
        img.removeAttribute('src');
        img.removeAttribute('alt');
        img.removeAttribute('data-src');
      }
    }
    
function moveToNextTab(currentTabKey) {
  const currentInput = document.getElementById(currentTabKey);
  if (!currentInput) return;

  // 次のinput(tab)を探す
  let nextInput = currentInput;
  while ((nextInput = nextInput.nextElementSibling)) {
    if (nextInput.tagName === "INPUT" && nextInput.type === "radio") {
      nextInput.checked = true;                 // ラジオON
      nextInput.nextElementSibling.click();     // ペアのlabelをクリック
      break;
    }
  }
}
    function handleImageClick(img, tabKey, scopeEl) {
      const src = img.dataset.src;
      let selected = tabSelections[tabKey] || [];
      const isSelected = selected.includes(src);

      if (isSelected) {
        img.classList.remove('selected');
        removeNumberingAndBorder(img.parentElement);
        selected = selected.filter(s => s !== src);
      } else {
        if (selected.length >= MAX_SELECTION) {
          alert('選択できる画像は1枚までです');
          return;
        }
        img.classList.add('selected');
        selected.push(src);
        addNumberingAndBorder(img.parentElement, selected.length);
        
        moveToNextTab(tabKey);
      }

      tabSelections[tabKey] = selected;
      
      setSaveImage(tabKey, selected[0] || null, img.dataset.category);

      updateImageNumbers(tabKey, scopeEl);
    }

    function updateImageNumbers(tabKey, scopeEl) {
      const selected = tabSelections[tabKey] || [];

      // このタブ内だけクリアして付け直す
      scopeEl.querySelectorAll('.image-container').forEach(c => {
        c.style.outline = 'none';
        const lbl = c.querySelector('.selected-label');
        if (lbl) lbl.remove();
      });

      selected.forEach((src, idx) => {
        const img = scopeEl.querySelector(`.image-item[data-src="${src}"]`);
        if (img) addNumberingAndBorder(img.parentElement, idx + 1);
      });
    }

    function addNumberingAndBorder(container, number) {
      container.style.outline = '2px solid blue';
      let label = container.querySelector('.selected-label');
      if (!label) {
        label = document.createElement('div');
        label.className = 'selected-label';
        container.appendChild(label);
      }
      label.textContent = SELECTED_LABEL;
    }

    function removeNumberingAndBorder(container) {
      container.style.outline = 'none';
      const label = container.querySelector('.selected-label');
      if (label) label.remove();
    }

    function restoreSelectionState(tabKey, category, scopeEl) {
      const selected = tabSelections[tabKey] || [];
      scopeEl.querySelectorAll(`.image-item[data-category="${category}"]`).forEach(img => {
        if (selected.includes(img.dataset.src)) {
          addNumberingAndBorder(img.parentElement, selected.indexOf(img.dataset.src) + 1);
        }
      });
      updateImageNumbers(tabKey, scopeEl);
      setSaveImage(tabKey, selected[0] || null, category);
    }

    // 保存ボタンのクリックイベントを追加
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const tabCategory = document.querySelector('.tab-label.active').dataset.category;
            saveImage(tabCategory);
        });
    }
}

//-----------------------------------------------------------------------------------------
async function saveImage() {
  const node = document.getElementById('savearea');
  if (!node) return;

  submitVotes(tabSelections);

  // モバイル判定
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || navigator.maxTouchPoints > 0;

  // 表示切替（印刷用モード）
  node.classList.add('is-printing');

  // textarea → print-proxy 転記＆表示
  document.querySelectorAll('#savearea .entry').forEach(entry => {
    const ta = entry.querySelector('textarea');
    const proxy = entry.querySelector('.print-proxy');
    if (ta && proxy) {
      proxy.textContent = ta.value ?? '';
      proxy.style.display = 'block';
    }
  });

  try {
    // キャプチャ
    const canvas = await html2canvas(node, { useCORS: true, scale: 2 });
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.92));
    if (!blob) throw new Error('Blob 作成に失敗');

    // アカウント登録者ならクラウドにも保存(失敗しても無視、ローカル保存は継続)
    saveProfileImage(SITE_ID, blob).then(() => refreshSavedImageUI());
    markImageGenerationMissionAchieved();

    // ファイル名：yyyyMMdd_HHmmss
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const filename = `スタレチェックシート_${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.jpg`;

    if (isMobile) {
      // 共有シート優先
      try {
        const file = new File([blob], filename, { type: 'image/jpeg' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'スタレチェックシート',
            text: '写真アプリに保存してね'
          });
          return; // 共有で完了
        }
      } catch (e) {
        console.warn('Share canceled/failed, fallback.', e);
      }
      // 共有不可端末 → 新規タブで開いて長押し保存
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
      return;
    }

    // PC：即ダウンロード
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);

  } catch (e) {
    console.error('Error capturing image:', e);
    alert('画像の保存に失敗しました。もう一度お試しください。');
  } finally {
    // 表示を元に戻す
    document.querySelectorAll('#savearea .print-proxy').forEach(p => p.style.display = 'none');
    node.classList.remove('is-printing');
  }
}

document.addEventListener('DOMContentLoaded', () => {
    initLangSwitch();
    loadImages();
    initSavedImageUI();
    
    // 画像生成などでDOMが増えた後に、現在の言語でもう一度適用
    const currentLang =
      document.querySelector('input[name="lang"]:checked')?.value ||
      localStorage.getItem("lang") ||
      "ja";
    applyLang(currentLang);

    // ★ ここから追記：textareaを2行制限にする処理
    document.querySelectorAll('#savearea .entry textarea').forEach(ta => {
        ta.addEventListener('input', () => {
            const lines = ta.value.split('\n');
            if (lines.length > 2) {
                ta.value = lines.slice(0, 2).join('\n');
            }
        });
    });
});