/**
 * IPC Main communications index file.
 */

import { ipcMain, BrowserWindow, app } from 'electron';

// Other IPCs
const chartIPC = require('./chartIPC');
const recordIPC = require('./recordIPC');

const ipc = async () => {
  const mainWindow = await BrowserWindow.getAllWindows()[0];

  // Minimize window on minimize icon click
  ipcMain.on('window:minimize', () => {
    mainWindow.minimize();
  });

  // Close/quit window on minimize icon click
  ipcMain.on('window:close', () => {
    app.quit();
  });

  // Restore window on minimize icon click
  ipcMain.on('window:restore', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    mainWindow.isMaximized() === true
      ? mainWindow.restore()
      : mainWindow.maximize();
  });

  // Record communications
  recordIPC();

  // // Chart communications
  chartIPC();
};

export default ipc;