import React from 'react';

// Tooltip
import Tooltip from '@components/Tooltip/Tooltip.component';

const RecordIconButton = (props: any) => {
  const { isActive, onClick } = props;

  return (
    <Tooltip text="Record" placement="right">
      <button
        type="button"
        className={`icon-button ${
          isActive && 'icon-button-active bg-white bg-opacity-5'
        }`}
        onClick={onClick}
        disabled={true}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="2.5rem"
          height="2.5rem"
        >
          <g>
            <path d="M 17.691406 4 C 17.207031 3.988281 16.78125 4.328125 16.6875 4.804688 L 14.128906 17.597656 L 12.621094 12.707031 C 12.5 12.304688 12.140625 12.023438 11.71875 12 C 11.300781 11.980469 10.914062 12.21875 10.746094 12.605469 L 9.007812 16.667969 L 5 16.667969 C 4.640625 16.660156 4.304688 16.851562 4.121094 17.164062 C 3.941406 17.472656 3.941406 17.859375 4.121094 18.171875 C 4.304688 18.480469 4.640625 18.671875 5 18.667969 L 9.667969 18.667969 C 10.066406 18.667969 10.429688 18.429688 10.585938 18.0625 L 11.511719 15.898438 L 13.378906 21.960938 C 13.511719 22.398438 13.925781 22.6875 14.382812 22.664062 C 14.839844 22.640625 15.222656 22.3125 15.3125 21.863281 L 17.515625 10.851562 L 20.011719 27.8125 C 20.082031 28.285156 20.472656 28.640625 20.949219 28.664062 C 21.425781 28.6875 21.855469 28.371094 21.96875 27.910156 L 24.449219 18 L 27.667969 18 C 28.027344 18.003906 28.363281 17.816406 28.542969 17.503906 C 28.726562 17.191406 28.726562 16.808594 28.542969 16.496094 C 28.363281 16.183594 28.027344 15.996094 27.667969 16 L 23.667969 16 C 23.207031 16 22.808594 16.3125 22.695312 16.757812 L 21.253906 22.523438 L 18.65625 4.855469 C 18.585938 4.375 18.175781 4.011719 17.691406 4 Z M 17.691406 4 " />
          </g>
        </svg>
      </button>
    </Tooltip>
  );
};

export default RecordIconButton;
