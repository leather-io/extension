# Hiro Wallet—Web

[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/ldinpeekobnhjjdofggfgjlcehhmanlj?label=Chrome%20Web%20Store)](https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj)
[![Mozilla Add-on](https://img.shields.io/amo/stars/hiro-wallet?label=Firefox%20Add-on)](https://addons.mozilla.org/en-US/firefox/addon/hiro-wallet/)
[![coverage](https://raw.githubusercontent.com/hirosystems/stacks-wallet-web/gh-pages/badge.svg)](https://hirosystems.github.io/stacks-wallet-web/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/hirosystems/stacks-wallet-web)

Hiro Wallet is a browser extension for managing your digital assets, and connecting to apps built on the Stacks blockchain.

To use this extension with your own Stacks App, we recommend using [Connect](https://github.com/hirosystems/connect).

Table of Contents:

<!-- TOC depthFrom:2 -->

- [Development](#development)
  - [Setup](#setup)
  - [Dev mode](#dev-mode)
    - [Optional: run test app](#optional-run-test-app)
  - [Add extension to your browser](#add-extension-to-your-browser)
- [Production](#production)
  - [Building browser extensions](#building-browser-extensions)
  - [Install browser extension from source](#install-browser-extension-from-source)
- [Security](#security)
  - [Audit Report](#audit-report)

<!-- /TOC -->

## Development

This application is a Web Extension. There is no ability to run it as a standalone web application.

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

## Production

[See instructions on Hiro.so for installing from source for production usage.](https://www.hiro.so/wallet/install-web-source)

Alternatively, the following steps can be taken by _technical_ users with the latest version of node installed on their machines.

### Build from source

Run the following from within this repository's root directory if you've pulled it with Git:

```bash
yarn && yarn build && sh build-ext.sh
```

Alternatively, run the following if you've downloaded the source code as a zip file from GitHub:

#### Optional: Use docker

```
docker build -f Dockerfile -t stacks-wallet-web . \
  && docker run -d --name stacks-wallet-web stacks-wallet-web \
  && docker cp stacks-wallet-web:stacks-wallet-chromium.zip . \
  && docker rm -f stacks-wallet-web
```

The extension will be packaged as `stacks-wallet-chromium.zip`.

### Install from source

First, unzip the `stacks-wallet-chromium.zip` file that was generated in the previous step.

Then for Chrome, Brave or Edge:

1. Go to: `chrome://extensions`
2. Toggle: **"developer mode"** on.
3. Click on: **"Load unpacked"**
4. Select the new directory that was unzipped from `stacks-wallet-chromium.zip`.

Alternatively, for Firefox:

1. Go to: `about:debugging`
2. Click on **"This Firefox"**
3. Click on: **"Load Temporary Add-on…"**
4. Navigate inside the new directory that was unzipped from `stacks-wallet-chromium.zip`
5. Select the `manifest.json` file.

## Security

We consider the security of our systems a top priority. But no matter how much effort we put into system security, there can still be vulnerabilities present.

If you discover a security vulnerability, please use one of the following means of communications to report it to us:

- Report the security issue to our [HackerOne program](https://hackerone.com/hiro)
- Report the security issue directly at [security@hiro.so](mailto:security@hiro.so)

Please note this email is strictly for reporting security vulnerabilities. For support queries, contact [wallet@hiro.so](mailto:wallet@hiro.so). Your efforts to responsibly disclose your findings are sincerely appreciated and will be taken into account to acknowledge your contributions.

### Audit Report

In Q1 2021, Hiro partnered with [Least Authority](https://leastauthority.com/), a leading security consultancy with experience in the crypto space, to audit Hiro Wallet for Web. On April 29th 2021, after addressing the major concerns described in the initial findings, as well as a concluding sign off from the Least Authority team, a final report was delivered.

[Download and read the full report here](https://github.com/hirosystems/stacks-wallet-web/blob/main/public/docs/least-authority-security-audit-report.pdf)
