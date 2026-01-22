# Leather Test App

A companion web application for testing and developing the Leather browser extension. This app provides an interactive interface to test various extension features during development.

## Overview

The test app is a React-based web application that runs alongside the Leather extension. It allows developers to:

- Test wallet connection and authentication flows
- Interact with smart contracts on the Stacks blockchain
- Test Bitcoin transaction signing
- Verify signature functionality
- Debug extension behavior in real-time

## Getting Started

### Prerequisites

- The Leather extension must be built and loaded in your browser
- Node.js and pnpm installed

### Running the Test App

From the root of the repository, run:

```bash
pnpm dev:test-app
```

This will start the test app on [http://localhost:3000](http://localhost:3000).

> **Note**: Make sure the extension is running in dev mode (`pnpm dev`) in a separate terminal.

## Features

The test app provides several tabs for testing different functionality:

| Tab | Description |
|-----|-------------|
| **Debugger** | Debug tools and utilities for extension development |
| **Status** | Interact with a status smart contract |
| **Counter** | Test increment/decrement operations on a counter smart contract |
| **BNS** | Test Bitcoin Naming System (BNS) functionality |
| **Signature** | Test message signing capabilities |
| **Profile** | Test profile/authentication features |
| **Bitcoin** | Test Bitcoin-specific functionality (PSBTs, transactions) |

## Project Structure

```
test-app/
├── contracts/       # Sample Clarity smart contracts for testing
├── public/          # Static assets
├── src/
│   ├── common/      # Shared utilities and context
│   └── components/  # React components for each feature tab
└── webpack/         # Webpack configuration
```

## Smart Contracts

The `contracts/` directory contains sample Clarity smart contracts that can be deployed to testnet for testing purposes.

## Configuration

The test app uses a separate webpack configuration located in `test-app/webpack/`. It shares some dependencies with the main extension but runs as an independent application.

## Related Documentation

- [Main Extension README](../README.md)
- [Contributing Guide](../.github/CONTRIBUTING.md)
- [Leather Developer Documentation](https://leather.gitbook.io/developers/home/welcome)
