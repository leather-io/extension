# Hiro Wallet—Web

[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/ldinpeekobnhjjdofggfgjlcehhmanlj?label=Chrome%20Web%20Store)](https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj)
[![Mozilla Add-on](https://img.shields.io/amo/stars/hiro-wallet?label=Firefox%20Add-on)](https://addons.mozilla.org/en-US/firefox/addon/hiro-wallet/)
[![coverage](https://raw.githubusercontent.com/hirosystems/wallet/gh-pages/badge.svg)](https://hirosystems.github.io/wallet/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Hiro Wallet is the most popular and trusted wallet for apps built on Bitcoin. Connect to apps and manage assets secured by Bitcoin and Bitcoin L2s with battle-tested wallet for the Stacks blockchain.

To integrate this wallet into your app, we recommend [@stacks/connect](https://github.com/hirosystems/connect).

[📚 See Hiro Wallet Developer Documentation →](https://hirowallet.gitbook.io/developers)

[📩 Join the mailing list for updates →](https://forms.gle/sdZPu2jbX1AeQ8Fi9)

## Development

This application is a browser extension. There is no ability to run it as a standalone web application.

Each child of the `src` directory represents the JavaScript context in which it is ran.

### Dev mode

When working on the extension, you can run it in `development` mode which will watch for any file changes and
use `react-refresh` to update the extension as you work. This gives us near instant reloading of our changes, and
persists the state of the application between changes. To start development mode for the extension, run this command:

```bash
yarn dev
```

#### Optional: run test app

We bundle a test app to use along with the extension. It gives easy access to the various functions that the extension
can do.

In a separate terminal, run:

```bash
yarn dev:test-app
```

### Loading extension in your browser

You'll need to add it to your browser of choice. Hiro Wallet only
supports Chromium and Firefox browsers. When you run `yarn dev`, it will compile the application to the `/dist` folder

- [Chrome instructions](https://developer.chrome.com/docs/extensions/mv3/faq/#faq-dev-01)
- [Firefox instructions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#trying_it_out)

Note that to build for 'firefox' you will need to set the `.env` flag `TARGET_BROWSER` in `generate-manifest`

## Testing

Several testing scripts are available in [`package.json`](./package.json).

The integration tests expect the extension to be built prior to running. The extension can be built for tests with the command below.

```bash
yarn build:test
```

The integration tests use Playwright, which requires the system to have the browsers it needs. The following command installs everything Playwright needs.

```bash
yarn playwright install --with-deps
```

Note that the installed browsers are tied to the version of Playwright being used, and it may be necessary to run the above command again in some situations, such as when upgrading Playwright or switching branches. [Read the documentation for more information](https://playwright.dev/docs/cli#install-system-dependencies).

## Production

[See instructions on Hiro.so for installing from source for production usage.](https://www.hiro.so/wallet/install-web-source)

Alternatively, the following steps can be taken by _technical_ users with the latest version of node installed on their machines.

### Build from source

Run the following from within this repository's root directory if you've pulled it with Git:

```bash
yarn && yarn build && sh build-ext.sh
```

The extension is packaged as `stacks-wallet-chromium.zip`.

## Security

We consider the security of our systems a top priority. But no matter how much effort we put into system security, there can still be vulnerabilities present.

If you discover a security vulnerability, please use one of the following means of communications to report it to us:

- Report the security issue to our [HackerOne program](https://hackerone.com/hiro)
- Report the security issue directly at [security@hiro.so](mailto:security@hiro.so)

Please note this email is strictly for reporting security vulnerabilities. For support queries, contact [wallet@hiro.so](mailto:wallet@hiro.so). Your efforts to responsibly disclose your findings are sincerely appreciated and will be taken into account to acknowledge your contributions.

### Audit Report

In Q1 2021, Hiro partnered with [Least Authority](https://leastauthority.com/), a leading security consultancy with experience in the crypto space, to audit Hiro Wallet for Web. On April 29th 2021, after addressing the major concerns described in the initial findings, as well as a concluding sign off from the Least Authority team, a final report was delivered.

[Download and read the full report here](https://github.com/hirosystems/wallet/blob/main/public/docs/least-authority-security-audit-report.pdf)
