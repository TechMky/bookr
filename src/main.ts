import { app, BrowserWindow, ipcMain } from 'electron';
import { Item } from './render/item.interface';
import { fetchItem } from './render/item';

//this is for auto updates
require('update-electron-app')()

const windowStateKeeper = require('electron-window-state');

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

ipcMain.on('new-item', async (e: Electron.IpcMainEvent, itemUrl: string) => {

  const item: Item = await fetchItem(itemUrl);
  e.sender.send('new-item-success', item);

})
const createWindow = () => {
  //remember window state
  const windowState = windowStateKeeper({
    defaultWidth: 400, defaultHeight: 600
  });
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    x: windowState.x,
    y: windowState.y,
    height: windowState.height,
    width: windowState.width,
    minHeight: 600,
    minWidth: 400
  });

  windowState.manage(mainWindow);

  console.log(MAIN_WINDOW_WEBPACK_ENTRY)
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
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
