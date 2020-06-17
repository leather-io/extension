import { UserSession, AppConfig } from 'blockstack';
import './types';
import { popupCenter, setupListener } from './popup';

export const defaultAuthURL = 'https://app.blockstack.org';

export interface FinishedData {
  authResponse: string;
  userSession: UserSession;
}

export interface AuthOptions {
  // The URL you want the user to be redirected to after authentication.
  redirectTo?: string;
  manifestPath?: string;
  finished?: (payload: FinishedData) => void;
  authOrigin?: string;
  sendToSignIn?: boolean;
  userSession?: UserSession;
  appDetails: {
    name: string;
    icon: string;
  };
}

export const authenticate = async ({
  redirectTo = '/',
  manifestPath,
  finished,
  authOrigin,
  sendToSignIn = false,
  userSession,
  appDetails,
}: AuthOptions) => {
  if (!userSession) {
    const appConfig = new AppConfig(['store_write'], document.location.href);
    userSession = new UserSession({ appConfig });
  }
  if (userSession.isUserSignedIn()) {
    userSession.signUserOut();
  }
  const transitKey = userSession.generateAndStoreTransitKey();
  const authRequest = userSession.makeAuthRequest(
    transitKey,
    `${document.location.origin}${redirectTo}`,
    `${document.location.origin}${manifestPath}`,
    userSession.appConfig.scopes,
    undefined,
    undefined,
    {
      sendToSignIn,
      appDetails,
    }
  );

  const extensionURL = await window.BlockstackProvider?.getURL();
  const authURL = new URL(extensionURL || authOrigin || defaultAuthURL);
  const params = window.location.search
    .substr(1)
    .split('&')
    .filter(param => param.startsWith('utm'))
    .map(param => param.split('='));
  const urlParams = new URLSearchParams();
  params.forEach(([key, value]) => urlParams.set(key, value));
  urlParams.set('authRequest', authRequest);

  const path = sendToSignIn ? 'sign-in' : 'sign-up';

  const popup = popupCenter({
    url: `${authURL.origin}/#/${path}?${urlParams.toString()}`,
  });

  // setupListener({ popup, authRequest, finished, authURL, userSession });
  setupAuthListener({ popup, authURL, authRequest, finished, userSession });
};

interface FinishedEventData {
  authResponse: string;
  authRequest: string;
  source: string;
}

interface ListenerParams {
  popup: Window | null;
  authRequest: string;
  finished?: (payload: FinishedData) => void;
  authURL: URL;
  userSession: UserSession;
}

const setupAuthListener = ({
  popup,
  authRequest,
  finished,
  authURL,
  userSession,
}: ListenerParams) => {
  setupListener<FinishedEventData>({
    popup,
    finished: async (data: FinishedEventData) => {
      if (data.authRequest === authRequest) {
        if (finished) {
          const { authResponse } = data;
          await userSession.handlePendingSignIn(authResponse);
          finished({
            authResponse,
            userSession,
          });
        }
      }
    },
    messageParams: {
      authRequest,
    },
    authURL,
  });
};
