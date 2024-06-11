# Leather
123
[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/ldinpeekobnhjjdofggfgjlcehhmanlj?label=Chrome%20Web%20Store)](https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj)
[![coverage](https://raw.githubusercontent.com/leather-wallet/extension/gh-pages/badge.svg)](https://leather-wallet.github.io/extension/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![storybook](https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg)](https://storybook.leather.io)

Leather is the most popular and trusted wallet for apps built on Bitcoin. Connect to apps and manage assets secured by Bitcoin and Bitcoin L2s with battle-tested wallet for the Stacks blockchain.

[📚 See Leather Developer Documentation →](https://leather.gitbook.io/developers/home/welcome)

[📩 Join the mailing list for updates →](https://forms.gle/sdZPu2jbX1AeQ8Fi9)

### Contibuting

Please see our [contribution guide](.github/CONTRIBUTING.md)

## Development

This application is a Web Extension. There is no ability to run it as a standalone web application.

Each child of the `src` directory represents the script context in which it is ran.

### Install packages

```bash
pnpm i
```

### Dev mode

```bash
pnpm dev
```

#### Optional: run test app

We bundle a test app to use along with the extension. It gives easy access to the various functions that the extension
can do.

In a separate terminal, run:

```bash
pnpm dev:test-app
```

### Loading extension in your browser

You'll need to add it to your browser of choice. Leather only
supports Chromium and Firefox browsers. When you run `pnpm dev`, it will compile the application to the `/dist` folder

- [Chrome instructions](https://developer.chrome.com/docs/extensions/mv3/faq/#faq-dev-01)
- [Firefox instructions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#trying_it_out)

## Testing

Several testing scripts are available in [`package.json`](./package.json).

The integration tests expect the extension to be built prior to running. The extension can be built for tests with the command below.

```bash
pnpm build:test
```

The integration tests use Playwright, which requires the system to have the browsers it needs. The following command installs everything Playwright needs.

```bash
pnpm playwright install --with-deps
```

Note that the installed browsers are tied to the version of Playwright being used, and it may be necessary to run the above command again in some situations, such as when upgrading Playwright or switching branches. [Read the documentation for more information](https://playwright.dev/docs/cli#install-system-dependencies).

All integration tests can be run using:

```bash
pnpm test:integration
```

To run a suite of tests you can use:

```bash
pnpm playwright test specs/TEST.spec.ts
pnpm playwright test tests/specs --shard=3/8
```

To get more information when running tests you can pass the `--debug` flag or the `--ui` flag to playwright.

When running tests locally you must add the following to your `.env` file:

```
WALLET_ENVIRONMENT=testing
```

### Unit tests

Unit tests can be run with vitest using:

```bash
pnpm test:unit
```

## Production

[See instructions on Leather.io to install from source](https://leather.io/install-extension)

Alternatively, the following steps can be taken by _technical_ users with the latest version of node installed on their machines.

### Build from source

Run the following from within this repository's root directory if you've pulled it with Git:

```bash
pnpm && pnpm prepare && pnpm build
```

The extension is now built in the `./dist` folder.

### Firefox reviewers

To build the extension in Firefox mode, the `TARGET_BROWSER=firefox` variable needs to be set.

```bash
pnpm && pnpm prepare && TARGET_BROWSER=firefox pnpm build
```

Note that when building in a clean environment, some code may vary between this and the submitted build. This is because some variables are set within the scope of the production build's CI.

## Security

We consider the security of our systems a top priority. But no matter how much effort we put into system security, there can still be vulnerabilities present.

If you discover a security vulnerability, please use one of the following means of communications to report it to us:

- Report the security issue to our [HackerOne program](https://hackerone.com/leather_wallet)
- Report the security issue directly at [security@leather.io](mailto:security@leather.io)

Please note this email is strictly for reporting security vulnerabilities. For support queries, contact [contact@leather.io](mailto:contact@leather.io). Your efforts to responsibly disclose your findings are sincerely appreciated and will be taken into account to acknowledge your contributions.

### Audit Report

In Q1 2021, Leather partnered with [Least Authority](https://leastauthority.com/), a leading security consultancy with experience in the crypto space, to audit Leather. On April 29th 2021, after addressing the major concerns described in the initial findings, as well as a concluding sign off from the Least Authority team, a final report was delivered.

[Download and read the full report here](https://github.com/leather-wallet/extension/blob/main/public/docs/least-authority-security-audit-report.pdf)
