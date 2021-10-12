declare namespace api {
  function on(channel: any, func: any): any;
  function send(channel: any, ...args: any): any;
  function invoke(channel: any, ...args: any): any;
  function removeListener(channel: any, customFunction: any): any;

  // Window functions
  const window: {
    minimize: () => void;
    close: () => void;
    restore: () => void;
  };

  // Record functions
  function sendRecordState(state: string, patientId?: number): void;
  function getRecordingData(func: (data: any) => void): void;

  // DB functions
  function getRecentExperiments(numOfExp: number): Promise<Array<Object>>;
  function createNewExperiment(data: Object): Promise<Boolean>;
  function getRecordingDataFromDB(): void;
  function getRecordingOnKeyDown(interval: object): Promise<Array<Object>>;

  // IPC Renderer Functions
  function removeChartEventListeners(): void;

  // Remove Event Listeners
  function removeHomePageEventListeners(): void;
  function removeRecentExperimentEventListeners(): void;

  // Experiment
  const experiment: {
    newExp: (expData: Object) => Promise<any>;
  };
}
