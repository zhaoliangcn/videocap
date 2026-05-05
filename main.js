const { app, BrowserWindow, globalShortcut, desktopCapturer, ipcMain, dialog, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let isRecording = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile('index.html');
}

async function getSavePath() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const defaultName = `recording-${timestamp}.webm`;
  
  const result = await dialog.showSaveDialog({
    title: '保存录制',
    defaultPath: path.join(app.getPath('desktop'), defaultName),
    filters: [
      { name: 'WebM Video', extensions: ['webm'] }
    ]
  });
  
  return result.filePath;
}

function toggleRecording() {
  if (isRecording) {
    mainWindow.webContents.send('stop-recording');
  } else {
    mainWindow.webContents.send('start-recording');
    isRecording = true;
    mainWindow.minimize();
    mainWindow.webContents.send('recording-started');
  }
}

function stopRecording() {
  if (isRecording) {
    mainWindow.webContents.send('stop-recording');
  }
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('CommandOrControl+Shift+R', () => {
    toggleRecording();
  });

  globalShortcut.register('CommandOrControl+Shift+S', () => {
    stopRecording();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

ipcMain.on('toggle-recording', () => {
  toggleRecording();
});

ipcMain.on('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.on('close-window', () => {
  mainWindow.close();
});

ipcMain.handle('get-screen-sources', async () => {
  const sources = await desktopCapturer.getSources({ 
    types: ['screen'],
    thumbnailSize: { width: 0, height: 0 }
  });
  return sources.map(s => ({ id: s.id, name: s.name }));
});

ipcMain.handle('save-recording', async (event, buffer) => {
  const savePath = await getSavePath();
  if (savePath) {
    fs.writeFileSync(savePath, Buffer.from(buffer));
    return savePath;
  }
  return null;
});

ipcMain.on('recording-finished', () => {
  isRecording = false;
  mainWindow.restore();
  mainWindow.focus();
  
  new Notification({
    title: '录制完成',
    body: '视频已保存到桌面'
  }).show();
  
  mainWindow.webContents.send('recording-stopped');
});

ipcMain.on('recording-error', (event, error) => {
  isRecording = false;
  mainWindow.restore();
  mainWindow.webContents.send('recording-error', error);
});
