const imageFolder = 'chara/';
const imageData = [
    { src: 'syu5.png', category: 'chara' },
    { src: 'sei5.png', category: 'chara' },
    { src: 'ginro2.png', category: 'chara' },
    { src: 'jin2.png', category: 'chara' },
    { src: 'sutera.png', category: 'chara' },
    { src: 'sinazu.png', category: 'chara' },
    { src: 'hiei.png', category: 'chara' },
    { src: 'koukou.png', category: 'chara' },
    { src: 'hibana.png', category: 'chara' },
    { src: 'daria.png', category: 'chara' },
    { src: 'kyurene.png', category: 'chara' },   
    { src: 'tankou2.png', category: 'chara' },
    { src: 'nagayatuki.png', category: 'chara' },
    { src: 'keryu.png', category: 'chara' },
    { src: 'seirensu.png', category: 'chara' },
    { src: 'fainon.png', category: 'chara' },
    { src: 'atya.png', category: 'chara' },
    { src: 'seiba.png', category: 'chara' },
    { src: 'saferu.png', category: 'chara' },
    { src: 'hiansi.png', category: 'chara' },
    { src: 'anaikusu.png', category: 'chara' },
    { src: 'kyasuto.png', category: 'chara' },
    { src: 'modis.png', category: 'chara' },
    { src: 'toribi.png', category: 'chara' },
    { src: 'syu4.png', category: 'chara' },
    { src: 'sei4.png', category: 'chara' },
    { src: 'aguraia.png', category: 'chara' },
    { src: 'heltamama.png', category: 'chara' },
    { src: 'newteiun.png', category: 'chara' },
    { src: 'sunday.png', category: 'chara' },
    { src: 'ranpa.png', category: 'chara' },
    { src: 'moze.png', category: 'chara' },
    { src: 'reisa.png', category: 'chara' },
    { src: 'hisyo.png', category: 'chara' },
    { src: 'nanoka2.png', category: 'chara' },
    { src: 'syokyu.png', category: 'chara' },
    { src: 'unri.png', category: 'chara' },
    { src: 'syu3.png', category: 'chara' },
    { src: 'sei3.png', category: 'chara' },
    { src: 'jeido.png', category: 'chara' },
    { src: 'hotaru.png', category: 'chara' },
    { src: 'boothill.png', category: 'chara' },
    { src: 'robin.png', category: 'chara' },
    { src: 'gyaraga.png', category: 'chara' },
    { src: 'aben.png', category: 'chara' },
    { src: 'yomi.png', category: 'chara' },
    { src: 'misia.png', category: 'chara' },
    { src: 'hanabi.png', category: 'chara' },
    { src: 'swan.png', category: 'chara' },
    { src: 'setui.png', category: 'chara' },
    { src: 'reisio.png', category: 'chara' },
    { src: 'ruanmama.png', category: 'chara' },
    { src: 'kana.png', category: 'chara' },
    { src: 'arujen.png', category: 'chara' },
    { src: 'fofo.png', category: 'chara' },
    { src: 'ketya.png', category: 'chara' },
    { src: 'topazu.png', category: 'chara' },
    { src: 'keiryu.png', category: 'chara' },
    { src: 'rinkusu.png', category: 'chara' },
    { src: 'ingetsu.png', category: 'chara' },
    { src: 'hugen.png', category: 'chara' },
    { src: 'ruka.png', category: 'chara' },
    { src: 'kahuka.png', category: 'chara' },
    { src: 'jin.png', category: 'chara' },
    { src: 'gyoku.png', category: 'chara' },
    { src: 'rasetu.png', category: 'chara' },
    { src: 'ginro.png', category: 'chara' },
    { src: 'byakuro.png', category: 'chara' },
    { src: 'genkyo.png', category: 'chara' },
    { src: 'susyo.png', category: 'chara' },
    { src: 'keigen.png', category: 'chara' },
    { src: 'teiun.png', category: 'chara' },
    { src: 'seijaku.png', category: 'chara' },
    { src: 'syu2.png', category: 'chara' },
    { src: 'sei2.png', category: 'chara' },
    { src: 'hukku.png', category: 'chara' },
    { src: 'sanpo.png', category: 'chara' },
    { src: 'kurara.png', category: 'chara' },
    { src: 'pera.png', category: 'chara' },
    { src: 'natasya.png', category: 'chara' },
    { src: 'jepado.png', category: 'chara' },
    { src: 'sebaru.png', category: 'chara' },
    { src: 'zere.png', category: 'chara' },
    { src: 'buronya.png', category: 'chara' },
    { src: 'helta.png', category: 'chara' },
    { src: 'aster.png', category: 'chara' },
    { src: 'aran.png', category: 'chara' },
    { src: 'velto.png', category: 'chara' },
    { src: 'himeko.png', category: 'chara' }, 
    { src: 'tankou.png', category: 'chara' },    
    { src: 'nanoka.png', category: 'chara' },  
    { src: 'syu1.png', category: 'chara' },  
    { src: 'sei1.png', category: 'chara' },
   
    { src: 'version/4_1.png', category: 'version' },
    { src: 'version/4_0.png', category: 'version' },
    { src: 'version/3_8.png', category: 'version' },
    { src: 'version/3_7.png', category: 'version' },
    { src: 'version/3_6.png', category: 'version' },
    { src: 'version/3_5.png', category: 'version' },
    { src: 'version/3_4.png', category: 'version' },
    { src: 'version/3_3.png', category: 'version' },
    { src: 'version/3_2.png', category: 'version' },
    { src: 'version/3_1.png', category: 'version' },
    { src: 'version/3_0.png', category: 'version' },
    { src: 'version/2_7.png', category: 'version' },
    { src: 'version/2_6.png', category: 'version' },
    { src: 'version/2_5.png', category: 'version' },
    { src: 'version/2_4.png', category: 'version' },
    { src: 'version/2_3.png', category: 'version' },
    { src: 'version/2_2.png', category: 'version' },
    { src: 'version/2_1.png', category: 'version' },
    { src: 'version/2_0.png', category: 'version' },
    { src: 'version/1_6.png', category: 'version' },
    { src: 'version/1_5.png', category: 'version' },
    { src: 'version/1_4.png', category: 'version' },
    { src: 'version/1_3.png', category: 'version' },
    { src: 'version/1_2.png', category: 'version' },
    { src: 'version/1_1.png', category: 'version' },
    { src: 'version/1_0.png', category: 'version' }
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
        img.src = `${imageFolder}${imgData.src}`;
        img.dataset.src = imgData.src;
        img.dataset.category = imgData.category;
        img.classList.add('image-item');
        img.addEventListener('click', () => handleImageClick(img, tabKey, container));

        wrap.appendChild(img);
        container.appendChild(wrap);
      });
    }
    
    function setSaveImage(tabKey, src) {
      // 該当する保存枠を探す
      const entry = document.querySelector(`#savearea .entry[data-key="${tabKey}"]`);
      if (!entry) return;

      const img = entry.querySelector('.imgheight img');
      if (!img) return;

      if (src) {
        img.src = `${imageFolder}${src}`;  // フォルダ＋ファイル名
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
      
      setSaveImage(tabKey, selected[0] || null);
  
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
      setSaveImage(tabKey, selected[0] || null);
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