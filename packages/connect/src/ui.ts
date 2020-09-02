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
  });
  element.addEventListener('signIn', () => {
    authenticate({
      ...authOptions,
      sendToSignIn: true,
    });
  });
  const handleEsc = function (ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      document.removeEventListener('keydown', handleEsc);
      element.remove();
    }
  };
  element.addEventListener('closeModal', () => {
    document.removeEventListener('keydown', handleEsc);
    element.remove();
  });
  document.addEventListener('keydown', handleEsc);
};
