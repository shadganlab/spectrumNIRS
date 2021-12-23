import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import PrimaryButton from '@components/Buttons/PrimaryButton.component';
import BorderButton from '@components/Buttons/BorderButton.component';

// Constants
import { UpdaterChannels } from '@utils/channels';

const UpdaterUI = () => {
  const downloadUpdate = () => {
    window.api.sendIPC(UpdaterChannels.DownloadUpdate);
    toast.dismiss();
  };

  const installUpdate = () => {
    window.api.sendIPC(UpdaterChannels.InstallUpdate);
    toast.dismiss();
  };

  // Update available
  useEffect(() => {
    window.api.onIPCData(UpdaterChannels.UpdateAvailable, (_, data) => {
      toast(
        (t) => (
          <div className="">
            <h3 className="text-xl text-accent font-semibold">
              New Update available!
            </h3>
            <p className="my-2">Version: {data.version || ''}</p>
            <p className="text-base my-1 mb-2">
              Please take a backup of your data by exporting it to either excel
              or text file before updating.
            </p>
            <div className="flex justify-end gap-2">
              <PrimaryButton
                text="Download update"
                onClick={() => downloadUpdate()}
              />
              <BorderButton
                text="Dismiss"
                onClick={() => toast.dismiss(t.id)}
              />
            </div>
          </div>
        ),
        { duration: 10000 }
      );
    });

    window.api.onIPCData(UpdaterChannels.DownloadingUpdate, (_, data) => {
      console.log(data);
    });

    window.api.onIPCData(UpdaterChannels.UpdateDownloaded, () => {
      toast.dismiss();
      toast(
        (t) => (
          <div className="">
            <h3 className="text-xl text-accent font-semibold">
              Ready to Install!
            </h3>
            <p className="text-base my-1 mb-2">
              The software will restart in order to install update. Please save
              your work!
            </p>
            <div className="flex justify-end gap-2">
              <PrimaryButton
                text="Install update"
                onClick={() => installUpdate()}
              />
              <BorderButton
                text="Dismiss"
                onClick={() => toast.dismiss(t.id)}
              />
            </div>
          </div>
        ),
        { duration: 10000 }
      );
    });

    console.log('Updater');
  }, []);

  return <div></div>;
};
export default UpdaterUI;
