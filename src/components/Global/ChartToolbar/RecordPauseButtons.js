import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeRecordState } from '@redux/RecordStateSlice';

//Components
import IconButton from '@globalComponent/IconButton/IconButton.component';

//Icons
import RecordIcon from '@icons/record.svg';
import StopIcon from '@icons/stop.svg';
import PauseIcon from '@icons/pause.svg';

//Electron
const { ipcRenderer } = window.require('electron');

const RecordPauseButtons = () => {
  //Record button state
  const recordState = useSelector(state => state.recordState.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (recordState !== 'idle') {
      dispatch(changeRecordState('idle'));
    }
    return () => {
      dispatch(changeRecordState('idle'));
    };
  }, []);

  //Change the record state on click.
  const recordBtnClickHandler = () => {
    if (recordState !== 'idle' && recordState !== 'stop') {
      dispatch(changeRecordState('stop'));
    } else {
      dispatch(changeRecordState('recording'));
    }
  };

  //Change the record state on click.
  const pauseBtnClickHandler = () => {
    recordState === 'pause' ? dispatch(changeRecordState('continue')) : dispatch(changeRecordState('pause'));
  };

  //Send record state state to ipcMain
  useEffect(() => {
    //Send ipc message if record state is not idle.
    recordState !== 'idle' && ipcRenderer.send(`record:${recordState}`);
  }, [recordState]);

  //Set button's styles based on the state value.
  switch (recordState) {
    case 'idle':
    case 'stop':
      return (
        <>
          <IconButton
            text="Record"
            icon={RecordIcon}
            darker={true}
            onClick={recordBtnClickHandler}
            isActive={false}
          />
          <IconButton
            text="Pause"
            icon={PauseIcon}
            darker={false}
            isActive={false}
            disabled={true}
            tooltip={true}
            tooltipText="Start a recording first"
          />
        </>
      );

    case 'continue':
      return (
        <>
          <IconButton
            text="Stop"
            icon={StopIcon}
            darker={true}
            onClick={recordBtnClickHandler}
            isActive={true}
          />
          <IconButton
            text="Pause"
            icon={PauseIcon}
            darker={true}
            onClick={pauseBtnClickHandler}
            isActive={false}
          />
        </>
      );
    case 'recording':
      return (
        <>
          <IconButton
            text="Stop"
            icon={StopIcon}
            darker={true}
            onClick={recordBtnClickHandler}
            isActive={true}
          />
          <IconButton
            text="Pause"
            icon={PauseIcon}
            darker={true}
            onClick={pauseBtnClickHandler}
            isActive={false}
          />
        </>
      );

    case 'pause':
      return (
        <>
          <IconButton
            text="Stop"
            icon={StopIcon}
            darker={true}
            onClick={recordBtnClickHandler}
            isActive={true}
          />
          <IconButton
            text="Paused"
            icon={PauseIcon}
            darker={true}
            onClick={pauseBtnClickHandler}
            isActive={true}
          />
        </>
      );

    default:
      return;
  }
};

export default RecordPauseButtons;