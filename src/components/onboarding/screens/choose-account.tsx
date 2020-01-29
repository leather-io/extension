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
import { selectIdentities } from '@store/wallet/selectors';
import Identity from '@blockstack/keychain/dist/identity';

interface ChooseAccountProps {
  next?: () => void;
  back?: () => void;
}

export const ChooseAccount: React.FC<ChooseAccountProps> = () => {
  const { appName, identities } = useSelector((state: AppState) => ({
    appName: selectAppName(state),
    identities: selectIdentities(state) as Identity[]
  }))
  const [showing, setShowing] = React.useState(false);

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
            <Accounts identities={identities} />,
          ]}
        />
      </Screen>
    </Box>
  );
};
