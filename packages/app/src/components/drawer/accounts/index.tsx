import React from 'react';
import { BaseDrawer, BaseDrawerProps } from '../index';
import { SwitchAccounts } from './switch-accounts';
import { CreateAccount } from './create-account';
import { AddUsername } from './add-username';
import { useRecoilValue } from 'recoil';
import { accountDrawerStep, AccountStep } from '@store/recoil';

export const AccountsDrawer: React.FC<BaseDrawerProps> = ({ showing, close }) => {
  const step = useRecoilValue(accountDrawerStep);
  return (
    <BaseDrawer showing={showing} close={close}>
      {step === AccountStep.Switch ? <SwitchAccounts close={close} /> : null}
      {step === AccountStep.Create ? <CreateAccount close={close} /> : null}
      {step === AccountStep.Username ? <AddUsername close={close} /> : null}
    </BaseDrawer>
  );
};
