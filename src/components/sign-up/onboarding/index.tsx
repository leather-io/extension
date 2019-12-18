import React, { useState, useEffect } from 'react';
import { Create, SecretKey, Connect, SaveKey, SignIn, Final } from './screens';
import DecryptRecoveryCode from './screens/decrypt-recovery-code';
import { doChangeScreen, doSaveAuthRequest } from '../../../store/onboarding/actions';
import { useSelector, useDispatch } from 'react-redux';
import { IAppState } from '../../../store';
import { Screen } from '../../../store/onboarding/types';
import { selectCurrentScreen, selectDecodedAuthRequest, selectAuthRequest } from '../../../store/onboarding/selectors';
import { authenticationInit, finalizeAuthResponse } from '../../../common/utils';
import { Wallet } from '@blockstack/keychain';

const RenderScreen = ({ ...rest }) => {
  const dispatch = useDispatch();
  const { screen, decodedAuthRequest, authRequest } = useSelector((state: IAppState) => ({
    screen: selectCurrentScreen(state),
    decodedAuthRequest: selectDecodedAuthRequest(state),
    authRequest: selectAuthRequest(state),
  }));

  // TODO
  const doFinishSignIn = async (wallet: Wallet) => {
    if (!wallet || !decodedAuthRequest || !authRequest) {
      console.error('Uh oh! Finished onboarding without auth info.');
      return;
    }
    const gaiaUrl = 'https://hub.blockstack.org';
    const appURL = new URL(decodedAuthRequest.redirect_uri);
    await wallet.identities[0].refresh();
    const authResponse = await wallet.identities[0].makeAuthResponse({
      gaiaUrl,
      appDomain: appURL.origin,
      transitPublicKey: decodedAuthRequest.public_keys[0],
    });
    finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
  };
  const doFinishOnboarding = doFinishSignIn;

  const [hasSaved, setHasSaved] = useState(false);
  switch (screen) {
    // create
    case Screen.CREATE:
      return <Create next={() => dispatch(doChangeScreen(Screen.SECRET_KEY))} {...rest} />;

    // Key screens
    case Screen.SECRET_KEY:
      return (
        <SecretKey next={() => dispatch(doChangeScreen(hasSaved ? Screen.CONNECT_APP : Screen.SAVE_KEY))} {...rest} />
      );

    case Screen.SAVE_KEY:
      return (
        <SaveKey
          next={() => {
            setHasSaved(true);
            dispatch(doChangeScreen(Screen.CONNECT_APP));
          }}
          {...rest}
        />
      );

    // Connect
    case Screen.CONNECT_APP:
      return (
        <Connect
          next={() => dispatch(doChangeScreen(Screen.CONNECTED))}
          back={() => dispatch(doChangeScreen(Screen.SECRET_KEY))}
          {...rest}
        />
      );

    case Screen.CONNECTED:
      return (
        <Final
          next={async (wallet: Wallet) => {
            await doFinishOnboarding(wallet);
          }}
          back={() => dispatch(doChangeScreen(Screen.SECRET_KEY))}
          {...rest}
        />
      );

    // Sign In

    case Screen.SIGN_IN:
      return (
        <SignIn
          next={async (wallet: Wallet) => await doFinishSignIn(wallet)}
          back={() => {
            dispatch(doChangeScreen(Screen.SECRET_KEY));
          }}
          {...rest}
        />
      );

    case Screen.RECOVERY_CODE:
      return <DecryptRecoveryCode next={async (wallet: Wallet) => await doFinishSignIn(wallet)} />;

    default:
      return null;
  }
};

const Onboarding: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const authRequest = authenticationInit();
    if (authRequest) {
      dispatch(doSaveAuthRequest(authRequest));
    }
  }, []);
  return <RenderScreen />;
};

export { Onboarding };
