import React, { useEffect, useState } from 'react';
import { ChooseAccount, Connect, Create, SaveKey, SecretKey, SignIn, Username } from './screens';
import { DecryptRecoveryCode } from './screens/decrypt-recovery-code';
import { doChangeScreen, doSaveAuthRequest } from '@store/onboarding/actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@store';
import { ScreenName } from '@store/onboarding/types';
import { selectIdentities } from '@store/wallet/selectors';
import { selectAuthRequest, selectCurrentScreen, selectDecodedAuthRequest } from '@store/onboarding/selectors';
import { authenticationInit, finalizeAuthResponse } from '@common/utils';
import Identity from '@blockstack/keychain/dist/identity';

const RenderScreen = ({ ...rest }) => {
  const dispatch = useDispatch();
  const { screen, decodedAuthRequest, authRequest, identities } = useSelector((state: AppState) => ({
    screen: selectCurrentScreen(state),
    identities: selectIdentities(state),
    decodedAuthRequest: selectDecodedAuthRequest(state),
    authRequest: selectAuthRequest(state),
  }));

  // const doFinishSignIn = async (identityIndex = 0, identity?: Identity) => {
  const doFinishSignIn = async (
    { identityIndex, identity }: { identity?: Identity; identityIndex: number } = { identityIndex: 0 }
  ) => {
    if (!decodedAuthRequest || !authRequest || !identities) {
      console.error('Uh oh! Finished onboarding without auth info.');
      return;
    }
    const gaiaUrl = 'https://hub.blockstack.org';
    const appURL = new URL(decodedAuthRequest.redirect_uri);
    const currentIdentity = identity || identities[identityIndex];
    await currentIdentity.refresh();
    const authResponse = await currentIdentity.makeAuthResponse({
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

  const ChooseScreen = () => (
    <ChooseAccount
      next={async (identityIndex: number) => {
        await doFinishSignIn({ identityIndex });
      }}
      {...rest}
    />
  );

  const UsernameScreen = () => (
    <Username
      next={() => dispatch(doChangeScreen(ScreenName.CREATE))}
      doFinishSignIn={async identity => await doFinishSignIn({ identity, identityIndex: -1 })}
      {...rest}
    />
  );

  switch (screen) {
    // choose account
    // case ScreenName.CHOOSE_ACCOUNT:
    //   return <ChooseAccount next={() => console.log('testing')} {...rest} />;
    // username
    case ScreenName.USERNAME:
      if (identities && identities.length) {
        return <ChooseScreen />;
      }
      return <UsernameScreen />;

    case ScreenName.ADD_ACCOUNT:
      return <UsernameScreen />;

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
        return <ChooseScreen />;
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
