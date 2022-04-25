Object.assign(global, require('jest-chrome'));

// setup jsdom inside `node` test environment
const JSDOM = require('jsdom').JSDOM;
const LocalStorageMock = require('@tests/mocks/localStorage-mock').LocalStorageMock;

const dom = new JSDOM('', { url: 'http://localhost/' });

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.location = dom.window.location;
global.HTMLElement = dom.window.HTMLElement;

global.localStorage = dom.window.localStorage;
global.Storage = LocalStorageMock;
