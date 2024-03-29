import React from 'react';

// Tooltip
import Tooltip from '@components/Tooltip/Tooltip.component';

const HomeIconButton = (props: any) => {
  const { isActive, onClick } = props;
  let isDisabled = false;
  // Check if the button is active and set the styling accordingly
  let activeClass;
  if (isActive) {
    activeClass = 'icon-button-active';
  } else {
    activeClass = '';
  }

  return (
    <Tooltip text="Home" placement="right">
      <button
        type="button"
        className={`icon-button ${activeClass}`}
        onClick={onClick}
        disabled={isDisabled}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="3rem"
          height="3rem"
        >
          <g>
            <path d="M 16 2.59375 L 15.28125 3.28125 L 2.28125 16.28125 L 3.71875 17.71875 L 5 16.4375 L 5 28 L 14 28 L 14 18 L 18 18 L 18 28 L 27 28 L 27 16.4375 L 28.28125 17.71875 L 29.71875 16.28125 L 16.71875 3.28125 Z M 16 5.4375 L 25 14.4375 L 25 26 L 20 26 L 20 16 L 12 16 L 12 26 L 7 26 L 7 14.4375 Z M 16 5.4375 " />
          </g>
        </svg>
      </button>
    </Tooltip>
  );
};

export default HomeIconButton;
