import React from 'react';
import { Screen, ScreenBody } from '@blockstack/connect';
import { Box } from '@blockstack/ui';
import { Wallet, Identity } from '@blockstack/keychain';
import { ScreenHeader } from '@components/connected-screen-header';
import { Accounts } from '@components/accounts';
import { AppIcon } from '@components/app-icon';
import { useSelector } from 'react-redux';
import { AppState } from '@store';
import { selectAppName } from '@store/onboarding/selectors';
import { Drawer } from '@components/drawer';
import { selectIdentities, selectCurrentWallet } from '@store/wallet/selectors';
import { selectDecodedAuthRequest } from '@store/onboarding/selectors';
import { DecodedAuthRequest } from '@common/dev/types';
import { store } from '@store';

interface ChooseAccountProps {
  next: (identityIndex: number) => void;
  back?: () => void;
}

export const ChooseAccount: React.FC<ChooseAccountProps> = ({ next }) => {
  const { appName, identities, wallet } = useSelector((state: AppState) => ({
    appName: selectAppName(state),
    identities: selectIdentities(state) as Identity[],
    wallet: selectCurrentWallet(state) as Wallet,
  }));
  const [showing, setShowing] = React.useState(false);

  const didSelectAccount = ({ identityIndex }: { identityIndex: number }) => {
    const state = store.getState();
    const authRequest = selectDecodedAuthRequest(state);
    console.log(state, authRequest);
    if (!authRequest) {
      console.error('No authRequest found when selecting account');
      return;
    }
    console.log(authRequest);
    if (wallet.walletConfig && authRequest.scopes.includes('publish_data')) {
      const url = new URL(authRequest?.redirect_uri);
      const apps = wallet.walletConfig.identities[identityIndex]?.apps;
      if (apps) {
        let isReusing = false;
        Object.keys(apps).forEach(origin => {
          const app = apps[origin];
          console.log(app);
          if (origin !== url.origin && app.scopes.includes('publish_data')) {
            isReusing = true;
          }
        });
        if (isReusing) {
          setShowing(true);
          return;
        }
      }
      // if (wallet.walletConfig.identities[identityIndex]?.apps[url.origin])
    }
    next(identityIndex);
  };

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
            <Accounts identities={identities} next={(identityIndex: number) => didSelectAccount({ identityIndex })} />,
          ]}
        />
      </Screen>
    </Box>
  );
};
