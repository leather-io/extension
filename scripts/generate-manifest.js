/**
 * @typedef {import('@schemastore/web-manifest').JSONSchemaForWebApplicationManifestFiles} Manifest
 */
const deepMerge = require('deepmerge');

const IS_DEV = process.env.NODE_ENV === 'development';

const NODE_ENV = process.env.NODE_ENV ?? 'development';

const PREVIEW_RELEASE = process.env.PREVIEW_RELEASE;

const TARGET_BROWSER = process.env.TARGET_BROWSER ?? 'chromium';

function generateImageAssetUrlsWithSuffix(suffix = '') {
  return {
    128: `assets/connect-logo/Stacks128w${suffix}.png`,
    256: `assets/connect-logo/Stacks256w${suffix}.png`,
    512: `assets/connect-logo/Stacks512w${suffix}.png`,
  };
}

const environmentIcons = {
  development: {
    icons: generateImageAssetUrlsWithSuffix('-dev'),
  },
  production: {
    icons: generateImageAssetUrlsWithSuffix(PREVIEW_RELEASE ? '-preview' : ''),
  },
};

const contentSecurityPolicyEnvironment = {
  development:
    "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; frame-src 'none'; frame-ancestors 'none';",
  production:
    "default-src 'none'; connect-src *; style-src 'unsafe-inline'; img-src 'self' data: https:; script-src 'self' 'wasm-unsafe-eval'; object-src 'none'; frame-src 'none'; frame-ancestors 'none';",
};

const defaultIconEnvironment = {
  development: 'assets/connect-logo/Stacks128w-dev.png',
  production: 'assets/connect-logo/Stacks128w.png',
};

const browserSpecificConfig = {
  firefox: {
    background: {
      scripts: ['background.js'],
    },
    browser_specific_settings: {
      gecko: {
        id: '{e22ae397-03d7-4622-bd8f-ecaca8c9b277}',
      },
    },
  },
  chromium: {
    background: {
      service_worker: 'background.js',
    },
  },
};

/**
 * @type {Manifest} manifest
 */
const manifest = {
  manifest_version: 3,
  author: 'Hiro PBC',
  description:
    'Hiro Wallet is a safe way to manage your STX, sign into apps, and protect your funds while interacting with Clarity smart contracts.',
  permissions: ['contextMenus', 'storage'],
  commands: {
    _execute_browser_action: {
      suggested_key: {
        default: 'Ctrl+Shift+B',
        mac: 'MacCtrl+Shift+B',
      },
      description: 'Opens Stacks App',
    },
  },
  host_permissions: ['*://*/*'],
  content_security_policy: {
    extension_pages: contentSecurityPolicyEnvironment[NODE_ENV],
  },
  web_accessible_resources: [{ resources: ['inpage.js'], matches: ['*://*/*'] }],
  action: {
    default_title: 'Stacks',
    default_popup: 'popup.html',
    default_icon: defaultIconEnvironment[NODE_ENV],
  },
  options_ui: {
    page: 'index.html',
    open_in_tab: true,
  },
  content_scripts: [
    {
      js: ['content-script.js'],
      matches: ['*://*/*'],
      all_frames: true,
    },
  ],
};

const devManifest = {
  name: 'Hiro Wallet Dev',
};

const name = PREVIEW_RELEASE ? 'Hiro Wallet Preview' : 'Hiro Wallet';

const prodManifest = {
  name,
  icons: generateImageAssetUrlsWithSuffix(PREVIEW_RELEASE ? '-preview' : ''),
  action: {
    default_icon: `assets/connect-logo/Stacks128w${PREVIEW_RELEASE ? '-preview' : ''}.png`,
  },
};

function generateManifest(packageVersion) {
  if (!packageVersion)
    throw new Error('Version number must be passed to `generateManifest` function');

  const version = packageVersion.includes('-') ? packageVersion.split('-')[0] : packageVersion;

  const releaseEnvironmentConfig = IS_DEV ? devManifest : prodManifest;

  const browserConfig = browserSpecificConfig[TARGET_BROWSER];

  return deepMerge.all([
    { version },
    manifest,
    releaseEnvironmentConfig,
    browserConfig,
    environmentIcons[NODE_ENV],
  ]);
}

module.exports = generateManifest;
