import { LANGUAGES, getRequiredLanguages, getModelFileList, getTranslationPairs } from './models.js';
import { hasAllFiles, listCachedFiles } from './storage.js';
import { Translator } from './translator.js';

const translator = new Translator();
let debounceTimer = null;
const downloadingLanguages = new Set();

// DOM elements
const sourceLang = document.getElementById('source-lang');
const targetLang = document.getElementById('target-lang');
const sourceText = document.getElementById('source-text');
const targetText = document.getElementById('target-text');
const swapBtn = document.getElementById('swap-btn');
const copyBtn = document.getElementById('copy-btn');
const manageBtn = document.getElementById('manage-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const langList = document.getElementById('lang-list');
const statusEl = document.getElementById('status');
const downloadPrompt = document.getElementById('download-prompt');
const downloadPromptBtn = document.getElementById('download-prompt-btn');

function populateLanguageSelects() {
  const nonEnglish = LANGUAGES.filter(l => l.code !== 'en').sort((a, b) => a.name.localeCompare(b.name));
  const english = LANGUAGES.find(l => l.code === 'en');

  for (const select of [sourceLang, targetLang]) {
    select.innerHTML = '';
    const enOpt = document.createElement('option');
    enOpt.value = english.code;
    enOpt.textContent = english.name;
    select.appendChild(enOpt);

    for (const lang of nonEnglish) {
      const opt = document.createElement('option');
      opt.value = lang.code;
      opt.textContent = lang.name;
      select.appendChild(opt);
    }
  }

  const saved = loadPreferences();
  sourceLang.value = saved.source || 'en';
  targetLang.value = saved.target || 'es';
}

function loadPreferences() {
  try {
    const data = localStorage.getItem('translator-prefs');
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function savePreferences() {
  localStorage.setItem('translator-prefs', JSON.stringify({
    source: sourceLang.value,
    target: targetLang.value,
  }));
}

function setStatus(text) {
  statusEl.textContent = text;
}

async function checkLanguageAvailability() {
  const from = sourceLang.value;
  const to = targetLang.value;

  if (from === to) {
    downloadPrompt.style.display = 'none';
    return true;
  }

  const ready = await translator.isLanguagePairReady(from, to);
  downloadPrompt.style.display = ready ? 'none' : '';
  return ready;
}

async function doTranslation() {
  const from = sourceLang.value;
  const to = targetLang.value;
  const text = sourceText.value;

  if (!text.trim()) {
    targetText.value = '';
    return;
  }

  if (from === to) {
    targetText.value = text;
    return;
  }

  const ready = await checkLanguageAvailability();
  if (!ready) {
    targetText.value = '';
    return;
  }

  try {
    setStatus('Translating...');
    const result = await translator.translate(from, to, text);
    // Only update if input hasn't changed
    if (sourceText.value === text && sourceLang.value === from && targetLang.value === to) {
      targetText.value = result;
    }
    setStatus('Ready');
  } catch (err) {
    setStatus('Translation error');
    console.error('Translation error:', err);
  }
}

function scheduleTranslation() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(doTranslation, 300);
}

// Language Manager Modal
async function renderLanguageList() {
  const cachedFiles = await listCachedFiles();
  const cachedSet = new Set(cachedFiles);

  const nonEnglish = LANGUAGES.filter(l => l.code !== 'en').sort((a, b) => a.name.localeCompare(b.name));
  const installed = [];
  const available = [];

  for (const lang of nonEnglish) {
    const toEnFiles = getModelFileList(lang.code, 'en');
    const fromEnFiles = getModelFileList('en', lang.code);
    const allFiles = [...new Set([...toEnFiles, ...fromEnFiles])];
    const hasAll = allFiles.every(f => cachedSet.has(f));
    if (hasAll) {
      installed.push(lang);
    } else {
      available.push(lang);
    }
  }

  langList.innerHTML = '';

  if (installed.length > 0) {
    const header = document.createElement('li');
    header.style.cssText = 'font-weight:600; padding:0.5rem 0; color:var(--text-secondary); font-size:0.85rem;';
    header.textContent = 'INSTALLED';
    langList.appendChild(header);

    for (const lang of installed) {
      langList.appendChild(createLangItem(lang, true));
    }
  }

  if (available.length > 0) {
    const header = document.createElement('li');
    header.style.cssText = 'font-weight:600; padding:0.75rem 0 0.5rem; color:var(--text-secondary); font-size:0.85rem;';
    header.textContent = 'AVAILABLE';
    langList.appendChild(header);

    for (const lang of available) {
      langList.appendChild(createLangItem(lang, false));
    }
  }
}

function createLangItem(lang, isInstalled) {
  const li = document.createElement('li');
  li.className = 'lang-item';
  li.dataset.code = lang.code;

  const nameSpan = document.createElement('span');
  nameSpan.className = 'lang-name';
  nameSpan.textContent = lang.name;

  const actions = document.createElement('div');
  actions.className = 'lang-actions';

  if (downloadingLanguages.has(lang.code)) {
    const progressContainer = document.createElement('div');
    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    const fill = document.createElement('div');
    fill.className = 'progress-bar-fill';
    fill.id = `progress-${lang.code}`;
    fill.style.width = '0%';
    bar.appendChild(fill);
    progressContainer.appendChild(bar);
    const statusText = document.createElement('span');
    statusText.className = 'download-status';
    statusText.id = `dl-status-${lang.code}`;
    statusText.textContent = 'Downloading...';
    progressContainer.appendChild(statusText);
    actions.appendChild(progressContainer);
  } else if (isInstalled) {
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-danger btn-small';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteLanguage(lang.code));
    actions.appendChild(delBtn);
  } else {
    const dlBtn = document.createElement('button');
    dlBtn.className = 'btn btn-primary btn-small';
    dlBtn.textContent = 'Download';
    dlBtn.addEventListener('click', () => downloadLanguage(lang.code));
    actions.appendChild(dlBtn);
  }

  li.appendChild(nameSpan);
  li.appendChild(actions);
  return li;
}

async function downloadLanguage(code) {
  downloadingLanguages.add(code);
  renderLanguageList();

  try {
    await translator.downloadLanguage(code, (progress) => {
      const fill = document.getElementById(`progress-${code}`);
      const statusText = document.getElementById(`dl-status-${code}`);
      if (fill && progress.fileTotal > 0) {
        const pct = Math.round((progress.fileReceived / progress.fileTotal) * 100);
        fill.style.width = `${pct}%`;
      }
      if (statusText) {
        statusText.textContent = `File ${progress.filesCompleted + 1}/${progress.filesTotal}`;
      }
      if (progress.filesCompleted === progress.filesTotal) {
        if (statusText) statusText.textContent = 'Complete';
      }
    });
  } catch (err) {
    console.error('Download failed:', err);
  }

  downloadingLanguages.delete(code);
  renderLanguageList();
  checkLanguageAvailability();
}

async function deleteLanguage(code) {
  await translator.deleteLanguage(code);
  renderLanguageList();
  checkLanguageAvailability();
}

async function downloadCurrentPair() {
  const from = sourceLang.value;
  const to = targetLang.value;
  const langs = getRequiredLanguages(from, to);

  const progressEl = document.getElementById('download-prompt-progress');
  const fill = document.getElementById('download-prompt-fill');
  const statusText = document.getElementById('download-prompt-status');

  downloadPromptBtn.style.display = 'none';
  progressEl.style.display = '';

  for (const code of langs) {
    downloadingLanguages.add(code);
    try {
      await translator.downloadLanguage(code, (progress) => {
        if (fill && progress.fileTotal > 0) {
          const pct = Math.round((progress.fileReceived / progress.fileTotal) * 100);
          fill.style.width = `${pct}%`;
        }
        if (statusText) {
          statusText.textContent = `File ${progress.filesCompleted + 1}/${progress.filesTotal}`;
        }
      });
    } catch (err) {
      console.error('Download failed:', err);
      if (statusText) statusText.textContent = 'Download failed';
      downloadPromptBtn.style.display = '';
      progressEl.style.display = 'none';
      downloadingLanguages.delete(code);
      return;
    }
    downloadingLanguages.delete(code);
  }

  progressEl.style.display = 'none';
  downloadPromptBtn.style.display = '';
  renderLanguageList();
  checkLanguageAvailability();
}

// Event listeners
sourceText.addEventListener('input', scheduleTranslation);

sourceLang.addEventListener('change', () => {
  savePreferences();
  checkLanguageAvailability();
  scheduleTranslation();
});

targetLang.addEventListener('change', () => {
  savePreferences();
  checkLanguageAvailability();
  scheduleTranslation();
});

swapBtn.addEventListener('click', () => {
  const tmp = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = tmp;
  sourceText.value = targetText.value;
  targetText.value = '';
  savePreferences();
  checkLanguageAvailability();
  scheduleTranslation();
});

copyBtn.addEventListener('click', () => {
  if (targetText.value) {
    navigator.clipboard.writeText(targetText.value);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
  }
});

manageBtn.addEventListener('click', () => {
  renderLanguageList();
  modalOverlay.classList.add('active');
});

modalClose.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('active');
});

downloadPromptBtn.addEventListener('click', downloadCurrentPair);

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

// Handle shared text from Web Share Target API
function handleShareTarget() {
  const params = new URLSearchParams(window.location.search);
  const shared = params.get('text') || params.get('title') || params.get('url');
  if (shared) {
    sourceText.value = shared;
    // Clean the URL without reloading
    history.replaceState(null, '', window.location.pathname);
    return true;
  }
  return false;
}

// Init
translator.onStatus = setStatus;
populateLanguageSelects();
const hasSharedText = handleShareTarget();

translator.init().then(() => {
  checkLanguageAvailability();
  if (hasSharedText) scheduleTranslation();
}).catch(err => {
  setStatus('Failed to load translation engine');
  console.error('Init error:', err);
});
