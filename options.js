// Single source of truth for every setting. Loaded by both the content script and the popup.
// To add a new toggle: add an entry here and a matching `html[data-ysb-<key>]` rule in content.css.

const YSB_MASTER_KEY = 'enabled';
const YSB_CACHE_KEY = 'ysb-cache';

const YSB_GROUPS = [
  { id: 'player', title: 'Video player' },
  { id: 'thumbs', title: 'Thumbnails & lists' },
  { id: 'page', title: 'Rest of the page' },
];

const YSB_OPTIONS = [
  // Video player
  { key: 'progress-bar', group: 'player', default: true,
    label: 'Progress bar',
    desc: 'The red/grey seek bar, including on hover and while seeking with the keyboard.' },
  { key: 'time-display', group: 'player', default: true,
    label: 'Current time & duration',
    desc: 'The "1:23 / 10:00" readout.' },
  { key: 'hover-preview', group: 'player', default: true,
    label: 'Hover preview',
    desc: 'The thumbnail and timestamp shown when hovering the timeline.' },
  { key: 'chapters', group: 'player', default: true,
    label: 'Chapters in player',
    desc: 'Chapter markers and the chapter title next to the time.' },
  { key: 'most-replayed', group: 'player', default: true,
    label: '"Most replayed" graph',
    desc: 'The spike graph that shows where the action is.' },
  { key: 'seek-animation', group: 'player', default: false,
    label: 'Skip animation',
    desc: 'The "+10 seconds" overlay when double-tapping or skipping.' },

  // Thumbnails & lists
  { key: 'thumb-progress', group: 'thumbs', default: true,
    label: 'Watched-progress bars on thumbnails',
    desc: 'The red bar under thumbnails of videos you have started.' },
  { key: 'duration-badges', group: 'thumbs', default: false,
    label: 'Duration badges on thumbnails',
    desc: 'The "10:00" label on thumbnails (can reveal how long other matches are).' },

  // Rest of the page
  { key: 'description-chapters', group: 'page', default: false,
    label: 'Chapters & key moments list',
    desc: 'Chapter lists and "key moments" panels under or beside the video.' },
  { key: 'comments', group: 'page', default: false,
    label: 'Comments',
    desc: 'Comments are a common source of spoilers.' },
  { key: 'sidebar', group: 'page', default: false,
    label: 'Recommended videos',
    desc: 'The suggestions sidebar and end-screen cards.' },
];

function ysbDefaults() {
  const d = { [YSB_MASTER_KEY]: true };
  for (const o of YSB_OPTIONS) d[o.key] = o.default;
  return d;
}
