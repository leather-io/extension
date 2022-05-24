const deepMerge = require('deepmerge');

const IS_DEV = process.env.NODE_ENV === 'development';

const PREVIEW_RELEASE = process.env.PREVIEW_RELEASE;

function generateImageAssetUrlsWithSuffix(suffix) {
  return {
    128: `assets/connect-logo/Stacks128w${suffix}.png`,
    256: `assets/connect-logo/Stacks256w${suffix}.png`,
    512: `assets/connect-logo/Stacks512w${suffix}.png`,
  };
}

const manifest = {
  author: 'Hiro PBC',
  description:
    'Hiro Wallet is a safe way to manage your STX, sign into apps, and protect your funds while interacting with Clarity smart contracts.',
  permissions: ['contextMenus', 'storage', 'webRequest', 'webRequestBlocking', '*://*/*'],
  manifest_version: 2,
  background: {
    scripts: ['background.js'],
    persistent: true,
  },
  web_accessible_resources: ['inpage.js'],
  browser_action: {
    default_title: 'Stacks',
    default_popup: 'popup.html',
  },
  commands: {
    _execute_browser_action: {
      suggested_key: {
        default: 'Ctrl+Shift+B',
        mac: 'MacCtrl+Shift+B',
      },
      description: 'Opens Stacks App',
    },
  },
  options_ui: {
    page: 'index.html',
    open_in_tab: true,
  },
  content_scripts: [
    {
      js: ['content-script.js'],
      matches: ['*://*/*'],
    },
  ],
  browser_specific_settings: {
    gecko: {
      id: '{e22ae397-03d7-4622-bd8f-ecaca8c9b277}',
    },
  },
};

const devManifest = {
  name: 'Hiro Wallet Dev',
  content_security_policy:
    "script-src 'self' 'unsafe-eval'; object-src 'self'; frame-src 'none'; frame-ancestors 'none';",
  icons: generateImageAssetUrlsWithSuffix('-dev'),
  browser_action: {
    default_icon: 'assets/connect-logo/Stacks128w-dev.png',
  },
};

const name = PREVIEW_RELEASE ? 'Hiro Wallet Preview' : 'Hiro Wallet';

const prodManifest = {
  name,
  // CSP loosened to allow `wasm-eval` per
  // https://bugs.chromium.org/p/chromium/issues/detail?id=1268576
  content_security_policy:
    "default-src 'none'; connect-src *; style-src 'unsafe-inline'; img-src 'self' https:; script-src 'self' 'wasm-eval'; object-src 'none'; frame-src 'none'; frame-ancestors 'none';",
  icons: generateImageAssetUrlsWithSuffix(PREVIEW_RELEASE ? '-preview' : ''),
  browser_action: {
    default_icon: `assets/connect-logo/Stacks128w${PREVIEW_RELEASE ? '-preview' : ''}.png`,
  },
};

module.exports = packageVersion => {
  if (!packageVersion)
    throw new Error('Version number must be passed to `generateManifest` function');
  const version = packageVersion.includes('-') ? packageVersion.split('-')[0] : packageVersion;
  return deepMerge.all([{ version }, manifest, IS_DEV ? devManifest : prodManifest]);
};
