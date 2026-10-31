# Testing

## Automated checks

Run `npm test` with Node.js 18+. No npm packages are required.

Checks cover:
- JavaScript module syntax (`node --check`).
- Relative import of the installed noVNC client.
- Required touch/zoom controls.
- No hardcoded private domains, addresses, or user data.
- Mouse click/drag, zoom, and scroll event wiring (source-level invariants).

## Manual/browser integration checklist

Use a test VNC desktop with a visible application. Do not test button events on production applications with destructive controls.

1. Open `/mobile.html` in a mobile browser; verify remote screen fits within the viewport and is connected.
2. Swipe one finger; cursor must move *relative* to the movement.
3. Short tap and explicit `ЛКМ` button; the remote application must receive ButtonPress and ButtonRelease.
4. Long press > 0.48 s, move, release; verify dragging ends (no stuck button).
5. Pinch fingers apart. Scale should rise toward 8×; cursor must remain at the viewport center.
6. While zoomed, move a finger; screen should pan to follow the cursor.
7. Pinch together, then tap the zoom indicator; display returns to 1×.
8. Move two fingers in parallel; verify scroll without changing zoom.
9. Rotate the phone. Cursor and screen remain aligned; click still lands at its expected remote coordinate.
10. Toggle direct-touch mode. Zoom resets to 1× and taps follow noVNC's native handling.
11. Disconnect/reconnect VNC and verify gestures continue to work.
12. Verify the usual noVNC client and unrelated remote-control products are unaffected.

For X11 debugging, `xinput test-xi2 --root` can observe actual button events; execute it *inside the remote desktop's X session*. Never confuse a headless test screen with the real user's active desktop.

The original implementation was tested using headless Chrome mobile touch events and X11 RawButtonPress/RawButtonRelease on a local test display.
