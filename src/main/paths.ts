import path from 'path';
import { app } from 'electron';

// Constants
const name = 'SpectrumNIRS';

// Resources path
export const initialFilesPath = app.isPackaged
  ? path.join(process.resourcesPath, 'resources', 'initialData')
  : path.join(__dirname, '../../resources/initialData');

export const initialDbFilePath = path.join(initialFilesPath, 'spectrum.db');
export const initialSettingsFilePath = path.join(
  initialFilesPath,
  'user-settings.json'
);

// Main application data path
export const appDataPath = path.join(app.getPath('appData'), name);

// Database data path
export const databasePath = path.join(appDataPath, 'database');
export const databaseFile = path.join(databasePath, 'spectrum.db');

// Settings data path
export const settingsPath = path.join(appDataPath, 'settings');
export const settingsFilePath = path.join(settingsPath, 'user-settings.json');
