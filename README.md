# DEBORAH Library Studio — desktop build (Windows and macOS)

This wraps `app/index.html` (the whole offline app) in an Electron window and packages it
as a Windows installer and a portable `.exe`.

## You need
- A Windows PC or a Mac with **Node.js LTS** installed (https://nodejs.org) and an internet connection for the first `npm install`.

## Steps
1. Open a terminal (PowerShell) in this folder.
2. `npm install`          — downloads Electron and the packager (one time, a few minutes).
3. `npm start`            — opens the app in a desktop window to test it.
4. `npm run dist`         — builds into the `dist/` folder:
   - `DEBORAH Library Studio-2.20.0-nsis.exe`      → installer (Start-menu + desktop shortcut)
   - `DEBORAH Library Studio-2.20.0-portable.exe`  → runs from a USB stick, no install

**On a Mac:** run `npm run dist:mac` instead. It produces a `.dmg` (drag to Applications) and a `.zip` in `dist/`.
Build on the same kind of computer you are targeting: a Windows `.exe` can't be built from a Mac without extra tools, and a Mac app can't be built on Windows.

Only the installer or only the portable file (Windows): `npm run dist:installer` / `npm run dist:portable`.

## Gate / OPAC station (fullscreen kiosk)
`npm run kiosk` — or make a shortcut to the installed app with `--kiosk` added to its target.
Exit with Alt+F4.

## Where the data lives
Catalog, members and loans are stored on that computer, in `%APPDATA%\DEBORAH Library Studio` (Windows) or `~/Library/Application Support/DEBORAH Library Studio` (Mac)
(Help → Open data folder). The portable build uses the same folder on whichever PC runs it,
so moving to another PC does **not** move the data: use the app's own Backup / Restore.
Back up regularly, and before uninstalling or reinstalling Windows.

## Updating the app later
Replace `app/index.html` with the new file, raise `"version"` in `package.json`, run `npm run dist`.
Keep `app.setName(...)` in `main.js` unchanged so existing data is still found.

## Optional polish
- The icon (made from the app's own favicon) is in `build/` as `icon.icns` (Mac), `icon.ico` (Windows) and `icon.png`. Replace those files to change it.
- Set `"author"` in `package.json` to your name.

## Troubleshooting
- **macOS "cannot be opened because the developer cannot be verified"**: normal for an unsigned app. Right-click the app → *Open* → *Open*.
- **Windows SmartScreen "unknown publisher"**: normal for an unsigned app. Click *More info → Run anyway*.
  Removing it needs a paid code-signing certificate.
- **`Cannot create symbolic link` during `npm run dist`**: turn on Windows *Developer Mode*
  (Settings → For developers) or run the terminal as Administrator, then retry.
- **Barcode scanners** behave like a keyboard, so they work unchanged. Click inside the app first so it has focus.
