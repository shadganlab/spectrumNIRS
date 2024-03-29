// Controls the header/Titlebar of the app - Electron loads a frameless window.

import React from 'react';
import { useSelector } from 'react-redux';

// Components
import Logo from '@components/Logo/Logo.component';
import TopMenu from './TopMenu/TopMenu.component';
import WindowButtons from './WindowButtons/WindowButtons.component';

// Styles

const TitleBar = () => {
  const experimentData = useSelector((state: any) => state.experimentData);

  return (
    <header className="header w-full header-container relative items-center grid grid-cols-3 bg-grey1 z-50">
      <div className="h-full items-center align-middle">
        <div className="grid items-center grid-flow-col auto-cols-max h-full ">
          <div>
            <Logo />
          </div>
          <div className="ml-1">
            <TopMenu />
          </div>
        </div>
      </div>
      <div>
        <p className="text-center">{experimentData.currentExperiment.name}</p>
      </div>
      <WindowButtons />
    </header>
  );
};

export default TitleBar;
