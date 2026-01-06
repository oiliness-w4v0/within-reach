import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
const comboWindowMs = 400;
let lastPlusPressedAt = 0;
let lastEnterPressedAt = 0;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const showOrCreateWindow = () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow();
  }

  if (!mainWindow) {
    return;
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.show();
  mainWindow.focus();
};

const triggerComboIfReady = () => {
  if (lastPlusPressedAt === 0 || lastEnterPressedAt === 0) {
    return;
  }

  if (Math.abs(lastPlusPressedAt - lastEnterPressedAt) <= comboWindowMs) {
    showOrCreateWindow();
    lastPlusPressedAt = 0;
    lastEnterPressedAt = 0;
  }
};

const registerGlobalShortcut = () => {
  const plusTriggered = () => {
    lastPlusPressedAt = Date.now();
    triggerComboIfReady();
  };

  const enterTriggered = () => {
    lastEnterPressedAt = Date.now();
    triggerComboIfReady();
  };

  globalShortcut.register('Plus', plusTriggered);
  globalShortcut.register('Numadd', plusTriggered);
  globalShortcut.register('Enter', enterTriggered);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  registerGlobalShortcut();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
