# UX Server

A lightweight node.js server for various UX-related utilities.

## API

### `/api/faucet?address={ADDRESS}`

Get testnet funds from a faucet. Pass the recipient's STX address as the `address` parameter.

## Development

### Setup

Create a `.env` file like so:

~~~
FAUCET_PRIVATE_KEY=my-private-key-here
~~~

You can create a private key the Stacks 2.0 `blockstack-cli`.

### Running locally

`yarn dev:watch`

### Future features:

- Rate limiting of the faucet
- Sponsoring select transactions
