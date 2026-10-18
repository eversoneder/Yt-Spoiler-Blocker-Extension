// Builds the settings UI from YSB_OPTIONS (options.js) and saves to chrome.storage.sync.

const masterEl = document.getElementById('master');
const statusEl = document.getElementById('master-status');
const groupsEl = document.getElementById('groups');
const checkboxes = new Map();

function buildRow(option) {
  const row = document.createElement('div');
  row.className = 'row';

  const text = document.createElement('div');
  text.className = 'row-text';
  const label = document.createElement('div');
  label.className = 'row-label';
  label.textContent = option.label;
  const desc = document.createElement('div');
  desc.className = 'row-desc';
  desc.textContent = option.desc;
  text.append(label, desc);

  const sw = document.createElement('label');
  sw.className = 'switch';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('aria-label', option.label);
  const slider = document.createElement('span');
  slider.className = 'slider';
  sw.append(input, slider);

  input.addEventListener('change', () => chrome.storage.sync.set({ [option.key]: input.checked }));
  checkboxes.set(option.key, input);

  row.append(text, sw);
  return row;
}

function buildUI() {
  for (const group of YSB_GROUPS) {
    const section = document.createElement('section');
    const title = document.createElement('h2');
    title.textContent = group.title;
    section.append(title);
    for (const option of YSB_OPTIONS.filter((o) => o.group === group.id)) {
      section.append(buildRow(option));
    }
    groupsEl.append(section);
  }
}

function render(settings) {
  masterEl.checked = settings[YSB_MASTER_KEY];
  document.body.classList.toggle('disabled', !settings[YSB_MASTER_KEY]);
  statusEl.textContent = settings[YSB_MASTER_KEY]
    ? 'Blocking is on. Spoilers hidden on YouTube.'
    : 'Blocking is off. YouTube looks normal.';
  for (const [key, input] of checkboxes) input.checked = Boolean(settings[key]);
}

function setAll(value) {
  const patch = {};
  for (const o of YSB_OPTIONS) patch[o.key] = value;
  chrome.storage.sync.set(patch);
}

masterEl.addEventListener('change', () => chrome.storage.sync.set({ [YSB_MASTER_KEY]: masterEl.checked }));
document.getElementById('all-on').addEventListener('click', () => setAll(true));
document.getElementById('all-off').addEventListener('click', () => setAll(false));
document.getElementById('reset').addEventListener('click', () => chrome.storage.sync.set(ysbDefaults()));

buildUI();
chrome.storage.sync.get(ysbDefaults(), render);
chrome.storage.onChanged.addListener((_c, area) => {
  if (area === 'sync') chrome.storage.sync.get(ysbDefaults(), render);
});
