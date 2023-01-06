import { JSDOM } from 'jsdom';

globalThis.chrome = {
  storage: {
    local: {
      get() {},
      set() {},
      clear() {},
    },
  },
  runtime: {
    sendMessage() {},
  },
};

globalThis.VERSION = '';

const dom = new JSDOM('', { url: 'http://localhost/' });

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;

globalThis.localStorage = dom.window.localStorage;
