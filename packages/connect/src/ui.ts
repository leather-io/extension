import { authenticate, AuthOptions } from './auth';
import { defineCustomElements } from '@blockstack/connect-ui';

export const showBlockstackConnect = (authOptions: AuthOptions) => {
  defineCustomElements();
  const element = document.createElement('connect-modal');
  element.authOptions = authOptions;
  document.body.appendChild(element);
  element.addEventListener('signUp', () => {
    authenticate({
      ...authOptions,
      sendToSignIn: false,
    });
    console.log('signin up');
  });
  element.addEventListener('signIn', () => {
    console.log('signin in');
    authenticate({
      ...authOptions,
      sendToSignIn: true,
    });
  });
};
