const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs   = require('fs');

// ── Auto-updater ──────────────────────────────────────────────
// Checks GitHub Releases on every startup.
// If a newer version exists it downloads silently in background.
// When done, shows a prompt: "Install Now" or "Later".
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'A new version of MallookiOS is ready. Install now or next time you close the app.',
    buttons: ['Install Now', 'Later']
  }).then(({ response }) => {
    if (response === 0) autoUpdater.quitAndInstall();
  });
});

const CACHE_FILE = path.join(app.getPath('userData'), 'cache.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 1300, height: 860, minWidth: 950, minHeight: 650,
    title: 'MallookiOS',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#1a0a0f',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  win.once('ready-to-show', () => {
    win.show();
    // Check for updates after window is shown
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

ipcMain.handle('cache-save', (_e, json) => {
  fs.writeFileSync(CACHE_FILE, json, 'utf-8'); return { ok: true };
});
ipcMain.handle('cache-load', () => {
  if (!fs.existsSync(CACHE_FILE)) return { ok: true, data: null };
  return { ok: true, data: fs.readFileSync(CACHE_FILE, 'utf-8') };
});
ipcMain.handle('export-data', async (_e, json) => {
  const win = BrowserWindow.getFocusedWindow();
  const { filePath, canceled } = await dialog.showSaveDialog(win, {
    title: 'Export Backup',
    defaultPath: `mallooki_backup_${new Date().toISOString().slice(0,10)}.json`,
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (canceled || !filePath) return { ok: false };
  fs.writeFileSync(filePath, json, 'utf-8'); return { ok: true };
});
ipcMain.handle('import-data', async () => {
  const win = BrowserWindow.getFocusedWindow();
  const { filePaths, canceled } = await dialog.showOpenDialog(win, {
    title: 'Import Backup',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (canceled || !filePaths.length) return { ok: false };
  return { ok: true, data: fs.readFileSync(filePaths[0], 'utf-8') };
});
