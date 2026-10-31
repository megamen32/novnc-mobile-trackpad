# noVNC Mobile Trackpad

A single-file, mobile-friendly touchpad interface for [noVNC](https://github.com/novnc/noVNC).

Built on top of noVNC's existing VNC renderer and WebSocket connection. **This is not a VNC server or a fork of noVNC.** It adds a touchpad-style cursor, pinch-to-zoom that follows the cursor, and controls that fit on a phone screen.

## Features

- **Relative touchpad**: drag a finger to move the pointer instead of teleporting it to the touch position.
- **Pinch to zoom**: two fingers apart/together, from 1× to 8×.
- **Cursor-following camera**: when zoomed, the pointer stays at the viewport center while the remote desktop moves beneath it.
- **Tap / long press**: tap to click; hold to start a drag, move, then release.
- **Scrolling**: move two fingers together to scroll; pinch to zoom.
- **Buttons**: explicit left/right clicks, mobile text input, Tab, Enter, Backspace, Esc, Ctrl+A and fullscreen.
- **Fit to viewport**: the complete remote desktop is initially scaled to fit the phone. Remote screen resolution is unchanged.
- **Direct-touch mode**: switch to native noVNC touch input. Zoom resets, and toolbar clicks follow the last touch coordinates.
- **Paste from phone**: explicit permission-gated clipboard read or manual paste field; Unicode text is entered as VNC keyboard events by default.
- **IME-aware input**: composed characters are committed only after the composition finishes.
- **Mobile keyboard layout**: controls and cursor-following viewport stay above the phone keyboard.
- No frameworks, bundlers, telemetry, credentials, or remote third-party assets beyond noVNC.

## Install

Requirements:

1. An existing noVNC deployment. The web root must contain `core/rfb.js`.
2. WebSocket forwarding available at **`/websockify`** on the same public origin (host and port).
3. An HTTPS endpoint protected by your own authentication layer.

On Debian/Ubuntu systems with the standard package:

```sh
git clone https://github.com/megamen32/novnc-mobile-trackpad.git
cd novnc-mobile-trackpad
sudo install -m 644 mobile.html /usr/share/novnc/mobile.html
```

For other deployments, copy `mobile.html` to your noVNC web root alongside `core/`.

Open **`https://YOUR-REMOTE-HOST/mobile.html`** on a phone. If the page is cached, reload it. **No change to the existing noVNC homepage is required.**

For a minimal *local-only example*, if your VNC server listens on `127.0.0.1:5902`:

```sh
websockify --web=/usr/share/novnc 127.0.0.1:6082 127.0.0.1:5902
```

Put your existing authenticated HTTPS reverse proxy in front of port 6082 and make sure it forwards WebSocket Upgrade requests to the same upstream.

**Security:** Do not expose unauthenticated VNC or raw websockify to the Internet. Keep VNC and websockify bound to loopback, and require HTTPS plus authentication on the public frontend. This repository contains no credentials, private hostnames, or infrastructure configuration.

## Gestures

| Gesture | Behavior |
| --- | --- |
| One-finger drag | Relative cursor movement |
| Short tap | Left click |
| Long press, move, release | Drag and drop |
| Pinch apart/together | Zoom in/out, cursor stays centered |
| Two-finger parallel drag | Scroll |
| **ЛКМ** button | Explicit left click |
| **ПКМ** button | Right click |
| **Тачпад** button | Switch between touchpad and direct-touch |
| **1×–8×** indicator | Tap to reset zoom |
| **⌨ Ввод** | Mobile keyboard and special keys |
| **Буфер** | Insert from the phone clipboard or via manual paste |

## Mobile paste

1. Focus the intended text field **inside the remote desktop**.
2. Tap **Буфер → Из буфера**. Your browser may ask permission to read the phone's clipboard.
3. If the browser blocks clipboard access, long-press the local text field, select **Paste**, and tap **Вставить**.
4. **Через VNC** is an optional legacy clipboard + Ctrl+V method. It is **not** the default because older x11vnc versions may fail to synchronize X11 clipboard selections.

The default paste method types the text through VNC keyboard events, including Unicode keysyms. It works without additional server endpoints, though some remote applications may not accept all Unicode characters. **⌨ Ввод** provides regular typing and special keys (Tab, Enter, Backspace, Esc, Ctrl+A). The page reads your phone clipboard only after a button press, does not store the pasted text, and clears the manual input after transmission. Only paste into remote systems you trust.

Interface labels are currently in Russian. The controls work in ordinary mobile browsers.

## Compatibility and limitations

- Originally developed and tested on Ubuntu noVNC package **1:1.0.0-5** with Chrome and touch emulation. Functionality was also tested against a real X11 desktop using noVNC → websockify → x11vnc.
- This lightweight extension calls some **private noVNC JavaScript methods** (`_handleMouseMove`, `_handleMouseButton` and `_screen`). Compatibility with future noVNC versions is **not guaranteed**; verify after upgrading.
- When zoomed, panning follows the **touchpad cursor**, not the screen center of the pinch gesture.
- Text entry on mobile virtual keyboards can vary by platform and input method; not every remote app supports every Unicode keysym.
- iOS Safari can block direct clipboard reads; use the manual field instead.
- Legacy native VNC clipboard synchronization may fail with x11vnc; use the default keyboard-event paste.
- Browser fullscreen is restricted on some iPhone/Safari versions; landscape mode is usually better.

## Checks

```sh
npm test
```

The automated checks validate the client script and basic public-release invariants. Browser/VNC integration tests are described in [TESTING.md](TESTING.md).

## License and attribution

This touch UI is released under the **MIT License** (see [LICENSE](LICENSE)). It is a separate add-on. [noVNC](https://github.com/novnc/noVNC) is an independent upstream project licensed under **MPL-2.0**. Its source code is **not** included in this repository.

The original client was developed with AI assistance.
