/**
 * IPC Communication for record and pause buttons and electron.
 */

const { ipcMain } = require('electron');
const { resolve } = require('path');

const modulePath = resolve('./src/electron/Functions');

//NIRS Data reader module
const nirsReader = require(`${modulePath}/nirsReader`);

const recordIPC = () => {
  ipcMain.on('record:recording', () => {
    nirsReader();
  });

  ipcMain.on('record:pause', () => {
    console.log('Paused');
  });

  ipcMain.on('record:idle', () => {
    console.log('No recording');
  });
};

module.exports = recordIPC;
