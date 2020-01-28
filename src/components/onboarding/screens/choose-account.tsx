import React from 'react';
import { Screen, ScreenBody } from '@blockstack/connect';
import { Box } from '@blockstack/ui';
import { ScreenHeader } from '@components/connected-screen-header';
import { Accounts } from '@components/accounts';
import { AppIcon } from '@components/app-icon';
import { useSelector } from 'react-redux';
import { AppState } from '@store';
import { selectAppName } from '@store/onboarding/selectors';
import { Drawer } from '@components/drawer';
import { selectFirstIdentity } from '@store/wallet/selectors';

interface ChooseAccountProps {
  next?: () => void;
  back?: () => void;
}

const mockAccounts = [
  {
    username: 'johnnyappleseed.blockstack.id',
  },
  {
    username: 'somethingverylongandannoying.blockstack.id',
  },
  {
    username: 'thisisalongerusernamemaxlengthagaidzz.blockstack.id',
  },
];

const delay = 1500;

export const ChooseAccount: React.FC<ChooseAccountProps> = () => {
  const appName = useSelector((state: AppState) => selectAppName(state));
  const [showing, setShowing] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => {
      if (!showing) {
        setShowing(true);
      }
    }, delay);
  }, [showing]);
  const identityAddress = useSelector(selectFirstIdentity);

  return (
    <Box position="relative">
      <Drawer close={() => setShowing(false)} showing={showing} />
      <Screen textAlign="center">
        <ScreenHeader hideIcon title="Continue with Data Vault" />
        <AppIcon mt={3} mb={4} size="72px" />
        <ScreenBody
          title="Choose an account"
          body={[
            `to use with ${appName}`,
            <Accounts accounts={mockAccounts.map(acc => ({ ...acc, identityAddress }))} />,
          ]}
        />
      </Screen>
    </Box>
  );
};
