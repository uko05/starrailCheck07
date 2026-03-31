import { starrailChars, starrailVersions } from 'https://cdn.jsdelivr.net/gh/uko05/99_SharedImage@main/02_Starrail/chara_data/starrail_chars.js';

const imageFolder = 'https://cdn.jsdelivr.net/gh/uko05/99_SharedImage@main/02_Starrail/chara_full/';
const versionFolder = 'https://cdn.jsdelivr.net/gh/uko05/99_SharedImage@main/02_Starrail/version/';
const imageData = [
    ...starrailChars.map(c => ({ src: c.icon, category: 'chara' })),
    ...starrailVersions.map(v => ({ src: v, category: 'version' })),
];

const MAX_SELECTION = 1;
const SELECTED_LABEL = '☑';

// タブごとの選択状態を管理するためのオブジェクト
const tabSelections = {};

const i18n = {
  ja: {
    default: "デフォルト",
    hakai: "左バー消滅",
    title: "#スタレチェックシート",
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
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) throw new Error('Blob 作成に失敗');

    // ファイル名：yyyyMMdd_HHmmss
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const filename = `スタレチェックシート_${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.png`;

    if (isMobile) {
      // 共有シート優先
      try {
        const file = new File([blob], filename, { type: 'image/png' });
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