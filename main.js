/* DEBORAH Library Studio — Electron shell.
   The whole app is app/index.html (offline, no server). This file only opens it in a window. */
const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');

const KIOSK = process.argv.includes('--kiosk');   // fullscreen, no menu: handy for the gate / OPAC station

// Fixed name => fixed data folder (%APPDATA%\DEBORAH Library Studio). The catalog, members and loans
// live in the browser storage inside that folder, so this must not change between versions.
app.setName('DEBORAH Library Studio');

// One window only: a second launch just focuses the first (two windows editing one vault would clash).
if (!app.requestSingleInstanceLock()) { app.quit(); }

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1360, height: 880, minWidth: 1024, minHeight: 680,
    title: 'DEBORAH — Library Studio',
    backgroundColor: '#11161a',
    icon: path.join(__dirname, 'build', 'icon.png'),
    autoHideMenuBar: true,          // press Alt to show the menu
    fullscreen: KIOSK, kiosk: KIOSK,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });
  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Never navigate away from the app; open real web links in the default browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file://')) { e.preventDefault(); if (/^https?:\/\//i.test(url)) shell.openExternal(url); } });
  win.on('closed', () => { win = null; });
}

function buildMenu() {
  if (KIOSK) { Menu.setApplicationMenu(null); return; }
  const template = [
    { label: 'File', submenu: [{ role: 'quit' }] },
    { label: 'View', submenu: [
        { role: 'reload' }, { role: 'togglefullscreen' }, { type: 'separator' },
        { role: 'zoomIn' }, { role: 'zoomOut' }, { role: 'resetZoom' },
        ...(app.isPackaged ? [] : [{ type: 'separator' }, { role: 'toggleDevTools' }])
    ] },
    { label: 'Help', submenu: [
        { label: 'Open data folder', click: () => shell.openPath(app.getPath('userData')) },
        { label: 'About', click: () => dialog.showMessageBox({ type: 'info', title: 'About',
            message: 'DEBORAH Library Studio', detail: 'Version ' + app.getVersion() + '\nOffline edition — data is stored on this computer.' }) }
    ] }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(() => { buildMenu(); createWindow(); });
app.on('window-all-closed', () => { app.quit(); });
