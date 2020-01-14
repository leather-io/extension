import * as React from 'react';
import ExtStore from '@store/ext-store';
import ReactDOM from 'react-dom';
import { Store as ReduxStore } from 'redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../background/store';
import OptionsApp from './containers/OptionsApp';
import DevStore from '../dev/store';

const buildApp = (store: ReduxStore | ReturnType<typeof ExtStore>) => {
  ReactDOM.render(
    <Provider store={store as any}>
      <PersistGate loading={null} persistor={persistor}>
        <OptionsApp />
      </PersistGate>
    </Provider>,
    document.getElementById('options-root')
  );
};

if (EXT_ENV === 'web') {
  buildApp(DevStore);
} else {
  const store = ExtStore();
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  store.ready().then(() => buildApp(store));
}
