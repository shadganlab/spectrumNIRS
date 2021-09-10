//Controls the header/Titlebar of the app - Electron laods a frameless window.

import React from 'react';
import { useSelector } from 'react-redux';

//Components
import Logo from '@globalComponent/Logo/Logo.component';
import TopMenu from './TopMenu/TopMenu.component';
import WindowButtons from './WindowButtons/WindowButtons.component';

//Styles
import styles from './TitleBar.module.css';

const TitleBar = () => {
  const appState = useSelector(state => state.appState.value);

  return (
    <header
      className={`${styles.TitleBar} header-container relative items-center grid grid-cols-3 bg-grey1 z-50`}
    >
      <div className="h-full items-center align-middle">
        <div className="grid items-center grid-flow-col auto-cols-max h-full ">
          <div>
            <Logo />
          </div>
          <div>
            <TopMenu />
          </div>
        </div>
      </div>
      <div>{appState !== 'home' && <p className="text-center">File Name</p>}</div>
      <WindowButtons />
    </header>
  );
};

export default TitleBar;