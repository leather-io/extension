import { UserSession, AppConfig } from 'blockstack';
import './types';
import { popupCenter, setupListener } from './popup';
import { version } from '../package.json';
export const defaultAuthURL = 'https://app.blockstack.org';
if (typeof window !== 'undefined') {
    window.__CONNECT_VERSION__ = version;
}
export const isMobile = () => {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) {
        return true;
    }
    if (/iPad|iPhone|iPod/.test(ua)) {
        return true;
    }
    if (/windows phone/i.test(ua)) {
        return true;
    }
    return false;
};
/**
 * mobile should not use a 'popup' type of window.
 */
export const shouldUsePopup = () => {
    return !isMobile();
};
export const getOrCreateUserSession = (userSession) => {
    if (!userSession) {
        const appConfig = new AppConfig(['store_write'], document.location.href);
        userSession = new UserSession({ appConfig });
    }
    return userSession;
};
export const authenticate = async ({ redirectTo = '/', manifestPath, finished, onFinish, onCancel, authOrigin, sendToSignIn = false, userSession: _userSession, appDetails, }) => {
    var _a;
    const userSession = getOrCreateUserSession(_userSession);
    if (userSession.isUserSignedIn()) {
        userSession.signUserOut();
    }
    const transitKey = userSession.generateAndStoreTransitKey();
    const authRequest = userSession.makeAuthRequest(transitKey, `${document.location.origin}${redirectTo}`, `${document.location.origin}${manifestPath}`, userSession.appConfig.scopes, undefined, undefined, {
        sendToSignIn,
        appDetails,
        connectVersion: version,
    });
    const params = window.location.search
        .substr(1)
        .split('&')
        .filter(param => param.startsWith('utm'))
        .map(param => param.split('='));
    const urlParams = new URLSearchParams();
    params.forEach(([key, value]) => urlParams.set(key, value));
    urlParams.set('authRequest', authRequest);
    const path = sendToSignIn ? 'sign-in' : 'sign-up';
    const extensionURL = await ((_a = window.BlockstackProvider) === null || _a === void 0 ? void 0 : _a.getURL());
    const authURL = new URL(extensionURL || authOrigin || defaultAuthURL);
    const url = `${authURL.origin}/index.html#/${path}?${urlParams.toString()}`;
    if (shouldUsePopup()) {
        const popup = popupCenter({
            url,
            // If the extension is installed, dont worry about popup blocking
            // Otherwise, firefox will open the popup and a new tab.
            skipPopupFallback: !!window.BlockstackProvider,
        });
        setupAuthListener({
            popup,
            authRequest,
            onFinish: onFinish || finished,
            authURL,
            userSession,
            onCancel,
        });
        return;
    }
    document.location.href = url;
};
const setupAuthListener = ({ popup, authRequest, onFinish, onCancel, authURL, userSession, }) => {
    setupListener({
        popup,
        onCancel,
        onFinish: async (data) => {
            if (data.authRequest === authRequest) {
                if (onFinish) {
                    const { authResponse } = data;
                    await userSession.handlePendingSignIn(authResponse);
                    onFinish({
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
export const getUserData = async (userSession) => {
    userSession = getOrCreateUserSession(userSession);
    if (userSession.isUserSignedIn()) {
        return userSession.loadUserData();
    }
    if (userSession.isSignInPending()) {
        return userSession.handlePendingSignIn();
    }
    return null;
};
