import React from 'react';
import { useSelector } from 'react-redux';

import { Collapse } from '../../collapse';
import { IAppState } from '../../../../store';

import { selectAppName } from '../../../../store/onboarding/selectors';
import { faqs } from '../data';

import { doTrack, SECRET_KEY_INSTR_CONFIRMED } from '../../../../common/track';

import { OnboardingHeader } from '../../header';
import { ScreenBody, ScreenContent, ScreenActions } from '../../screen';

interface SaveKeyProps {
  next: () => void;
}

export const SaveKey: React.FC<SaveKeyProps> = ({ next }) => {
  const appName = useSelector((state: IAppState) => selectAppName(state));
  return (
    <>
      <ScreenBody>
        <OnboardingHeader appIcon close={() => console.log('sdklfjsdf')} />
        <ScreenContent
          title="Save your Secret Key"
          body={[
            'Paste your Secret Key wherever you keep critical, private, information such as passwords.',
            'Once lost, it’s lost forever. So save it somewhere you won’t forget.',
          ]}
        />
        <ScreenActions
          action={{
            label: "I've saved it",
            testAttr: 'button-has-saved-seed-phrase',
            onClick: () => {
              doTrack(SECRET_KEY_INSTR_CONFIRMED);
              next();
            },
          }}
        />
        <Collapse data={faqs(appName as string)} />
      </ScreenBody>
    </>
  );
};
