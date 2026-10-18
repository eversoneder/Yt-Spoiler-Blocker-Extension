// Runs on YouTube at document_start. Mirrors the saved settings onto <html> as
// `data-ysb-*` attributes; content.css does the actual hiding.
// options.js is loaded before this file and provides YSB_OPTIONS etc.

(function () {
  'use strict';

  const root = document.documentElement;
  let current = ysbDefaults();

  function apply(settings) {
    current = settings;
    for (const o of YSB_OPTIONS) {
      root.toggleAttribute('data-ysb-' + o.key, Boolean(settings[YSB_MASTER_KEY] && settings[o.key]));
    }
  }

  // Storage is async, so a synchronous cache on the page's own localStorage lets us
  // hide things before the first paint instead of flashing the progress bar.
  function readCache() {
    try {
      const raw = localStorage.getItem(YSB_CACHE_KEY);
      if (raw) return Object.assign(ysbDefaults(), JSON.parse(raw));
    } catch (_) { /* storage blocked: fall back to chrome.storage below */ }
    return null;
  }

  function writeCache(settings) {
    try { localStorage.setItem(YSB_CACHE_KEY, JSON.stringify(settings)); } catch (_) { /* ignore */ }
  }

  function load() {
    chrome.storage.sync.get(ysbDefaults(), (settings) => {
      apply(settings);
      writeCache(settings);
    });
  }

  apply(readCache() || ysbDefaults());
  load();

  chrome.storage.onChanged.addListener((_changes, area) => {
    if (area === 'sync') load();
  });

  // ---- Alt+Shift+S: quick master on/off from the keyboard ----

  let toast;
  let toastTimer;
  function showToast(text) {
    if (window.top !== window) return; // only in the top frame
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ysb-toast';
      (document.body || root).appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('ysb-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('ysb-visible'), 1500);
  }

  window.addEventListener('keydown', (e) => {
    if (!(e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey && e.code === 'KeyS')) return;
    e.preventDefault();
    e.stopPropagation();
    const next = !current[YSB_MASTER_KEY];
    apply(Object.assign({}, current, { [YSB_MASTER_KEY]: next }));
    chrome.storage.sync.set({ [YSB_MASTER_KEY]: next });
    showToast('Spoiler blocker ' + (next ? 'ON' : 'OFF'));
  }, true);
})();
