import { app, BrowserWindow, globalShortcut } from 'electron';
import { join } from 'path';
import Screenshots from 'electron-screenshots';

const isDevelopment = import.meta.env.DEV;

async function createWindow() {
  const mainWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      preload: join(__dirname, '../../preload/build/index.cjs'),
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();

    if (isDevelopment) {
      mainWindow?.webContents.openDevTools();
    }
  });

  const { RENDERER_DEV_SERVER_URL } = process.env;

  const pageUrl = isDevelopment && RENDERER_DEV_SERVER_URL
    ? RENDERER_DEV_SERVER_URL
    : new URL(join(__dirname, '../../renderer/build/index.html'), `file://${__dirname}`).toString();

  await mainWindow.loadURL(pageUrl);
}

async function screenshotsConfig() {
  const screenshots = new Screenshots();
  globalShortcut.register('ctrl+shift+x', () => {
    console.log('tj:--ctrl+shift+a');
    screenshots.startCapture();
    // screenshots.$view.webContents.openDevTools();
  });
  // 点击确定按钮回调事件
  screenshots.on('ok', (e, buffer, bounds) => {
    console.log('capture', buffer, bounds);
  });
  // 点击取消按钮回调事件;
  screenshots.on('cancel', () => {
    console.log('capture', 'cancel1');
  });
  screenshots.on('cancel', (e) => {
    // 执行了preventDefault
    // 点击取消不会关闭截图窗口
    e.preventDefault();
    console.log('capture', 'cancel2');
  });
  // 点击保存按钮回调事件
  screenshots.on('save', (e, buffer, bounds) => {
    console.log('capture', buffer, bounds);
  });
}
app.whenReady()
  .then(createWindow)
  .catch((e) => console.error('Failed to crate window:', e));

app.whenReady()
  .then(screenshotsConfig)
  .catch((e) => console.error('Failed to screenshotsConfig:', e));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (!isDevelopment) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}
