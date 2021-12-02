import React, { useState } from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';
import { setPatientData, setRecordingData } from '@redux/ExperimentDataSlice';
import { closeModal } from '@redux/ModalStateSlice';

// Icons
import PatientIcon from '@icons/user-checked.svg';
import ArrowDownIcon from '@icons/arrow-down.svg';
import RecordingIcon from '@icons/raw-data.svg';

// Constants
import { ExperimentChannels } from '@utils/channels';

type PatientData = {
  createdAt: string;
  description: string;
  dob: string;
  experimentId: number;
  id: number;
  name: string;
  updatedAt: string;
};

const SelectPatient = ({ patient }: { patient: PatientData }) => {
  const [recordings, setRecordings] = useState<null | any[]>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const getAllRecordings = async (patientId: number) => {
    const recordings = await window.api.invokeIPC(
      ExperimentChannels.getAllRecordings,
      patientId
    );
    setRecordings(recordings);
  };

  const handleOpenRecordingButton = (recording: any) => {
    dispatch(setPatientData(patient));
    dispatch(setRecordingData(recording));
    dispatch(closeModal());
  };

  return (
    <>
      <button
        className="w-full p-6 bg-grey2 hover:bg-grey3 cursor-pointer focus:bg-grey3 duration-150 rounded-md"
        onClick={() => {
          getAllRecordings(patient.id);
          setIsOpen(!isOpen);
        }}
        key={patient.id}
      >
        <div className="flex items-center w-full gap-5">
          <span className="w-[40px]">
            <img src={PatientIcon} width="40px" />
          </span>
          <span className="text-lg w-2/3 text-left">{patient.name}</span>
          <span className="w-1/3 text-right">
            Last Update: {patient.updatedAt.split(' ')[0]}
          </span>
          <span className="w-[25px] mb-1">
            <img
              className={`duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
              src={ArrowDownIcon}
              width="25px"
            />
          </span>
        </div>
      </button>
      <div
        className="w-full -mt-1 p-6 bg-grey3 pt-6 border-t-2 border-grey1 text-left"
        hidden={!isOpen}
      >
        {recordings &&
          recordings.map((recording: any, index: number) => (
            <div className="inline-block w-full rounded-sm border-light2 border-b-2 last:border-b-0">
              <button
                className="bg-grey1 hover:bg-accent px-4 py-2 w-full text-left flex items-center gap-4 rounded-sm"
                onClick={() => handleOpenRecordingButton(recording)}
                key={recording.id}
              >
                <span className="w-[40px]">
                  <img src={RecordingIcon} width="30px" />
                </span>
                <span className="w-2/3 font-medium">
                  Recording{index + 1}: {recording.name}
                </span>
                <span className="w-1/3 text-right">
                  {recording.updatedAt.split(' ')[0]}
                </span>
              </button>
            </div>
          ))}
        {recordings?.length === 0 && (
          <p>
            No recordings found for the patient:{' '}
            <span className="text-accent font-medium text-lg text-opacity-75">
              {patient.name}
            </span>
          </p>
        )}
      </div>
      <div className="mb-6"></div>
    </>
  );
};
export default SelectPatient;
