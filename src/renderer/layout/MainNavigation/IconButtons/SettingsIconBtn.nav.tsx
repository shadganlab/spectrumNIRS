import React from 'react';

// Tooltip
import Tooltip from '@components/Tooltip/Tooltip.component';

const SettingsIconButton = (props: any) => {
  const { isActive } = props;
  let isDisabled = false;
  // Check if the button is active and set the styling accordingly
  let activeClass;
  if (isActive) {
    activeClass = 'icon-button-active';
  } else {
    activeClass = '';
  }

  const handleClick = () => {
    window.api.sendIPC('settings:window');
  };

  return (
    <Tooltip text="Settings" placement="right">
      <button
        type="button"
        className={`icon-button ${activeClass}`}
        onClick={handleClick}
        disabled={isDisabled}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="2.4rem"
          height="2.4rem"
        >
          <g id="surface201062509">
            <path d="M 16 2.667969 C 14.949219 2.667969 13.933594 2.800781 12.96875 3.023438 C 12.554688 3.121094 12.246094 3.46875 12.199219 3.890625 L 11.988281 5.824219 C 11.917969 6.460938 11.550781 7.019531 11 7.339844 C 10.449219 7.660156 9.777344 7.695312 9.195312 7.4375 L 7.417969 6.65625 C 7.027344 6.484375 6.574219 6.578125 6.285156 6.886719 C 4.902344 8.359375 3.839844 10.144531 3.238281 12.132812 C 3.117188 12.539062 3.261719 12.980469 3.605469 13.230469 L 5.183594 14.386719 C 5.695312 14.765625 6 15.363281 6 16 C 6 16.636719 5.695312 17.234375 5.183594 17.613281 L 3.605469 18.769531 C 3.261719 19.019531 3.117188 19.457031 3.238281 19.863281 C 3.839844 21.855469 4.902344 23.640625 6.285156 25.113281 C 6.574219 25.421875 7.027344 25.515625 7.417969 25.34375 L 9.195312 24.5625 C 9.777344 24.304688 10.449219 24.339844 11 24.660156 C 11.550781 24.980469 11.917969 25.539062 11.988281 26.175781 L 12.199219 28.109375 C 12.246094 28.53125 12.554688 28.878906 12.964844 28.972656 C 13.933594 29.199219 14.949219 29.332031 16 29.332031 C 17.050781 29.332031 18.066406 29.199219 19.03125 28.976562 C 19.445312 28.878906 19.753906 28.53125 19.800781 28.109375 L 20.011719 26.175781 C 20.082031 25.539062 20.449219 24.980469 21 24.660156 C 21.550781 24.339844 22.222656 24.304688 22.804688 24.5625 L 24.582031 25.34375 C 24.972656 25.515625 25.425781 25.421875 25.714844 25.113281 C 27.097656 23.640625 28.160156 21.855469 28.761719 19.863281 C 28.882812 19.457031 28.738281 19.019531 28.394531 18.769531 L 26.816406 17.613281 C 26.304688 17.234375 26 16.636719 26 16 C 26 15.363281 26.304688 14.765625 26.816406 14.386719 L 28.394531 13.230469 C 28.738281 12.980469 28.882812 12.542969 28.761719 12.136719 C 28.160156 10.144531 27.097656 8.359375 25.714844 6.886719 C 25.425781 6.578125 24.972656 6.484375 24.582031 6.65625 L 22.804688 7.4375 C 22.222656 7.695312 21.550781 7.660156 21 7.339844 C 20.449219 7.019531 20.082031 6.460938 20.011719 5.824219 L 19.800781 3.890625 C 19.753906 3.46875 19.445312 3.121094 19.035156 3.027344 C 18.066406 2.800781 17.050781 2.667969 16 2.667969 Z M 16 4.667969 C 16.648438 4.667969 17.273438 4.785156 17.898438 4.894531 L 18.023438 6.042969 C 18.160156 7.308594 18.898438 8.433594 20 9.070312 C 21.101562 9.707031 22.445312 9.78125 23.609375 9.269531 L 24.667969 8.804688 C 25.480469 9.78125 26.121094 10.878906 26.570312 12.085938 L 25.632812 12.773438 C 24.609375 13.527344 24 14.726562 24 16 C 24 17.273438 24.609375 18.472656 25.632812 19.226562 L 26.570312 19.914062 C 26.121094 21.121094 25.480469 22.21875 24.667969 23.195312 L 23.609375 22.730469 C 22.445312 22.21875 21.101562 22.292969 20 22.929688 C 18.898438 23.566406 18.160156 24.691406 18.023438 25.957031 L 17.898438 27.105469 C 17.273438 27.214844 16.648438 27.332031 16 27.332031 C 15.351562 27.332031 14.726562 27.214844 14.101562 27.105469 L 13.976562 25.957031 C 13.839844 24.691406 13.101562 23.566406 12 22.929688 C 10.898438 22.292969 9.554688 22.21875 8.390625 22.730469 L 7.332031 23.195312 C 6.519531 22.21875 5.878906 21.121094 5.429688 19.914062 L 6.367188 19.226562 C 7.390625 18.472656 8 17.273438 8 16 C 8 14.726562 7.390625 13.527344 6.367188 12.773438 L 5.429688 12.085938 C 5.878906 10.878906 6.519531 9.777344 7.332031 8.804688 L 8.390625 9.269531 C 9.554688 9.78125 10.898438 9.707031 12 9.070312 C 13.101562 8.433594 13.839844 7.308594 13.976562 6.042969 L 14.101562 4.894531 C 14.726562 4.785156 15.351562 4.667969 16 4.667969 Z M 16 10.667969 C 13.066406 10.667969 10.667969 13.066406 10.667969 16 C 10.667969 18.933594 13.066406 21.332031 16 21.332031 C 18.933594 21.332031 21.332031 18.933594 21.332031 16 C 21.332031 13.066406 18.933594 10.667969 16 10.667969 Z M 16 12.667969 C 17.851562 12.667969 19.332031 14.148438 19.332031 16 C 19.332031 17.851562 17.851562 19.332031 16 19.332031 C 14.148438 19.332031 12.667969 17.851562 12.667969 16 C 12.667969 14.148438 14.148438 12.667969 16 12.667969 Z M 16 12.667969 " />
          </g>
        </svg>
      </button>
    </Tooltip>
  );
};

export default SettingsIconButton;