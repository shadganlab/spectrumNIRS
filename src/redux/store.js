import { configureStore } from '@reduxjs/toolkit';

//State slices
import AppStateReducer from '@redux/AppStateSlice';
import RecordStateReducer from '@redux/RecordStateSlice';
import SourceStateReducer from '@redux/SourceStateSlice';

export const store = configureStore({
  reducer: {
    appState: AppStateReducer,
    recordState: RecordStateReducer,
    sourceState: SourceStateReducer,
  },
});
