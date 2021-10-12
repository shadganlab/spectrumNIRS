const { ipcRenderer, contextBridge } = require('electron');

// Adds an object 'api' to the global window object:
contextBridge.exposeInMainWorld('api', {
  // Method for removing listeners if needed
  removeAllListener: ipcRenderer.removeAllListeners,

  /* Window functions */
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    restore: () => ipcRenderer.send('window:restore'),
    close: () => ipcRenderer.send('window:close'),
  },

  /* Record functions */
  getRecordingData: (func) => {
    ipcRenderer.on('data:reader-record', (event, ...args) => func(...args));
  },
  // Send record state along with the patient Id to create an associated record
  sendRecordState: (state, patientId) => {
    ipcRenderer.send(`record:${state}`, patientId);
  },

  /* DB functions */
  // create a new experiment in the database
  createNewExperiment: async (data) => {
    return await ipcRenderer.invoke('db:new-experiment', data);
  },

  // get recent some number of recent experiments
  getRecentExperiments: async (numOfExperiments) => {
    return await ipcRenderer.invoke(
      'db:get-recent-experiments',
      numOfExperiments
    );
  },

  // get all recording data from the database
  getRecordingDataFromDB: () => {
    ipcRenderer.send('db:get-recordings');
  },

  // Get recording based on arrow keys
  getRecordingOnKeyDown: async (interval) => {
    return await ipcRenderer.invoke('db:get-recording-interval', interval);
  },

  /* IPC renderer functions */
  removeChartEventListeners: () => {
    ipcRenderer.removeAllListeners('data:reader-record');
    ipcRenderer.removeAllListeners('db:get-recording-interval');
  },

  /* Home page event listener cleanup */
  removeHomePageEventListeners: () => {},

  /* Other event cleanup */
  removeRecentExperimentEventListeners: () => {
    ipcRenderer.removeAllListeners('db:get-recent-experiments');
  },

  experiment: {
    newExp: async (expData) =>
      await ipcRenderer.invoke(`experiment:newExp`, expData),
    newPatient: async (expData) =>
      await ipcRenderer.invoke(`experiment:new`, expData),
  },
});
