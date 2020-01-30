import React, { useEffect, useState } from 'react';
import { ChooseAccount, Connect, Create, SaveKey, SecretKey, SignIn, Username } from './screens';
import { DecryptRecoveryCode } from './screens/decrypt-recovery-code';
import { doChangeScreen, doSaveAuthRequest } from '@store/onboarding/actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@store';
import { ScreenName } from '@store/onboarding/types';
import { selectCurrentWallet, selectIdentities } from '@store/wallet/selectors';
import { selectAuthRequest, selectCurrentScreen, selectDecodedAuthRequest } from '@store/onboarding/selectors';
import { authenticationInit, finalizeAuthResponse } from '@common/utils';

const RenderScreen = ({ ...rest }) => {
  const dispatch = useDispatch();
  const { screen, wallet, decodedAuthRequest, authRequest, identities } = useSelector((state: AppState) => ({
    screen: selectCurrentScreen(state),
    wallet: selectCurrentWallet(state),
    identities: selectIdentities(state),
    decodedAuthRequest: selectDecodedAuthRequest(state),
    authRequest: selectAuthRequest(state),
  }));

  const doFinishSignIn = async (identityIndex = 0) => {
    if (!wallet || !decodedAuthRequest || !authRequest) {
      console.error('Uh oh! Finished onboarding without auth info.');
      return;
    }
    const gaiaUrl = 'https://hub.blockstack.org';
    const appURL = new URL(decodedAuthRequest.redirect_uri);
    console.log(identityIndex, wallet.identities[identityIndex]);
    await wallet.identities[identityIndex].refresh();
    const authResponse = await wallet.identities[identityIndex].makeAuthResponse({
      gaiaUrl,
      appDomain: appURL.origin,
      transitPublicKey: decodedAuthRequest.public_keys[0],
    });
    finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
  };
  const doFinishOnboarding = doFinishSignIn;

  const [hasSaved, setHasSaved] = useState(false);

  /**
   * TODO: make this check if logged in to data vault better
   */
  // React.useEffect(() => {
  //   if (screen !== ScreenName.CHOOSE_ACCOUNT && identities && identities.length) {
  //     dispatch(doChangeScreen(ScreenName.CHOOSE_ACCOUNT));
  //   }
  // }, [screen, identities]);

  switch (screen) {
    // choose account
    // case ScreenName.CHOOSE_ACCOUNT:
    //   return <ChooseAccount next={() => console.log('testing')} {...rest} />;
    // username
    case ScreenName.USERNAME:
      return (
        <Username next={() => dispatch(doChangeScreen(ScreenName.CREATE))} doFinishSignIn={doFinishSignIn} {...rest} />
      );

    // create
    case ScreenName.CREATE:
      return <Create next={() => dispatch(doChangeScreen(ScreenName.SECRET_KEY))} {...rest} />;

    // Key screens
    case ScreenName.SECRET_KEY:
      return (
        <SecretKey
          next={() => dispatch(doChangeScreen(hasSaved ? ScreenName.CONNECT_APP : ScreenName.SAVE_KEY))}
          {...rest}
        />
      );

    case ScreenName.SAVE_KEY:
      return (
        <SaveKey
          next={() => {
            setHasSaved(true);
            dispatch(doChangeScreen(ScreenName.CONNECT_APP));
          }}
          {...rest}
        />
      );

    // Connect
    case ScreenName.CONNECT_APP:
      return (
        <Connect
          next={async () => {
            await doFinishOnboarding();
          }}
          back={() => dispatch(doChangeScreen(ScreenName.SECRET_KEY))}
          {...rest}
        />
      );

    // Sign In
    case ScreenName.SIGN_IN:
      if (identities && identities.length) {
        return (
          <ChooseAccount
            next={async (identityIndex: number) => {
              await doFinishSignIn(identityIndex);
            }}
            {...rest}
          />
        );
      }
      return (
        <SignIn
          next={async () => await doFinishSignIn()}
          back={() => {
            dispatch(doChangeScreen(ScreenName.SECRET_KEY));
          }}
          {...rest}
        />
      );

    case ScreenName.RECOVERY_CODE:
      return <DecryptRecoveryCode next={async () => await doFinishSignIn()} />;

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
