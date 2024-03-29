// Icons
import ZoomInIcon from '@icons/zoom-in.svg';
import ZoomOutIcon from '@icons/zoom-out.svg';
import ResetZoom from '@icons/reset-zoom.svg';
import FocusModeIcon from '@icons/focus-mode.svg';
import ResetHeightIcon from '@icons/reset-height.svg';
import ChartScreenshotIcon from '@icons/chart-screenshot.svg';
import RawDataIcon from '@icons/raw-data.svg';
import ExportIcon from '@icons/export-data.svg';

import TimeDivisionIcon from '@icons/time-division.svg';

// Adapters
import ChartOptions from '../ChartClass/ChartOptions';

// Store
import { dispatch, getState } from '@redux/store';
import { toggleRawData } from '@redux/ChartSlice';
import { openModal } from '@redux/ModalStateSlice';
import { ModalConstants } from '@utils/constants';
import { DialogBoxChannels } from '@utils/channels';

export const ReviewToolbar = [
  {
    label: 'Zoom In',
    tooltip: 'Zoom In',
    icon: ZoomInIcon,
    isActive: false,
    click: () => {},
  },
  {
    label: 'Zoom Out',
    tooltip: 'Zoom Out',
    icon: ZoomOutIcon,
    isActive: false,

    click: () => {},
  },
  {
    label: 'Reset Zoom',
    tooltip: 'Reset Zoom',
    icon: ResetZoom,
    isActive: false,

    click: () => {},
  },
  {
    label: 'separator',
  },
  {
    label: 'Focus Icon',
    tooltip: 'Focus Mode',
    icon: FocusModeIcon,
    isActive: false,

    click: () => {},
  },
  {
    label: 'Reset Layout',
    tooltip: 'Reset Charts Layout',
    icon: ResetHeightIcon,
    click: (chartOptions: ChartOptions) => {
      chartOptions.resetChartsHeight();
    },
  },
  {
    label: 'separator',
  },
  {
    label: 'Take Screenshot',
    tooltip: 'Take Screenshot',
    icon: ChartScreenshotIcon,
    click: (chartOptions: ChartOptions) => {
      chartOptions.screenshot();
    },
  },

  {
    label: 'rawdata',
    tooltip: 'Display Raw Data',
    icon: RawDataIcon,
    click: () => {
      dispatch(toggleRawData());
    },
  },
  {
    label: 'separator',
  },
  {
    label: `exporttxt`,
    tooltip: 'Export To File (Text / Excel)',
    icon: ExportIcon,
    click: async () => {
      const recordingId = getState().experimentData.currentRecording.id;

      if (recordingId === -1) {
        window.api.invokeIPC(DialogBoxChannels.MessageBox, {
          title: 'No recording found',
          type: 'error',
          message: 'No recording found',
          detail:
            'No recording found. Either open a recording or create a new one.',
        });
        return;
      }

      dispatch(openModal(ModalConstants.EXPORT_FORM));

      // const result = window.api.invokeIPC(ChartChannels.ExportAll, recordingId);

      // toast.promise(result, {
      //   loading: 'Exporting Data',
      //   error: 'Export Failed!',
      //   success: 'Export Completed!',
      // });
    },
  },
  {
    label: 'separator',
  },
  {
    label: 'timeDivision',
    tooltip: 'timeDivision',
    icon: TimeDivisionIcon,
    click: () => {},
  },
];
