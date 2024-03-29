import React from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';
import { openModal } from '@redux/ModalStateSlice';

// Icons
import NewFileIcon from '@icons/new-file.svg';
import OpenFileIcon from '@icons/open-file.svg';

// Components
import HeadingText from './HeadingText/HeadingText.component';
import RecentExperiments from './RecentExperiments/RecentExperimentsContainer.component';
import LargeIconTextButton from '@components/Buttons/LargeIconTextButton.component';

// Constants
import { ModalConstants } from '@utils/constants';

const HomePage = () => {
  const dispatch = useAppDispatch();
  return (
    <div id="testing123" className="h-full mx-auto pt-12 lg:w-5/6 xl:w-4/6">
      <HeadingText />
      <div className="grid grid-cols-5 mt-10 h-full gap-10">
        <div className="col-span-3 h-3/4">
          <RecentExperiments />
        </div>
        <div className="col-span-2">
          <LargeIconTextButton
            icon={NewFileIcon}
            title="New Experiment"
            description="Create a new experiment"
            onClick={() => {
              dispatch(openModal(ModalConstants.NEWEXPERIMENT));
            }}
          />
          <LargeIconTextButton
            icon={OpenFileIcon}
            title="Open Experiment"
            description="Open an experiment file or project"
            onClick={() => dispatch(openModal(ModalConstants.OPEN_EXPERIMENT))}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
