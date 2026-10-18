# YT Spoiler Blocker

A browser extension that hides YouTube's timing clues (progress bar, duration, hover preview, chapters, "most replayed" graph, and more) so recorded matches and series can't be spoiled by "this video is only 10 minutes long, so the series must have ended 2-0".

Every hider is its own toggle in the popup, plus a master on/off switch. Works in Chrome, Edge, Brave, Opera and Vivaldi on Windows, macOS and Linux.

## Install (any computer)

1. Download this repo (**Code → Download ZIP**, then extract) or `git clone` it.
2. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the folder containing `manifest.json`.
5. Pin the extension from the puzzle-piece menu so the popup is one click away.

Your toggle settings sync through your browser account (`chrome.storage.sync`) once the extension is installed on each device.

To update later: pull/download the new files, then click the reload icon on the extension's card.

## Usage

- Click the toolbar icon to open the popup and switch individual hiders on or off.
- On YouTube, **Alt + Shift + S** toggles everything on/off without opening the popup.

## Project layout

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension definition (Manifest V3) |
| `options.js` | The list of toggles; single source of truth for the popup and content script |
| `content.js` | Applies the saved settings to the YouTube page as `data-ysb-*` attributes |
| `content.css` | The actual hiding rules, one block per toggle |
| `popup.html/css/js` | The settings UI |

## Adding or fixing a toggle

YouTube renames its elements from time to time. If something stops being hidden, right-click it → Inspect, find its class or tag, and add it to the matching block in `content.css`. To add a brand-new toggle, add an entry in `options.js` and a `html[data-ysb-<key>]` block in `content.css`; the popup builds itself from the list.
