---
'@stacks/wallet-web': minor
---

This update improves data fetching in the wallet in a few ways: removes duplicate fetches, migrates legacy fetching methods to use the api client from `@stacks/blockchain-api-client`, and fixes a few network related bugs. Additionally, work has started on improving how quickly the UI is available, working towards progressive upgrading of components as new data is available. Lastly, the foundation has been laid to enable use of persistence of certain data, enabling faster boot times.
