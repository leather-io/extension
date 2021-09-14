---
'@stacks/wallet-web': patch
---

This update adds the global variable VERSION to all cache keys for any data that is persisted in local storage. This makes it so when the wallet updates, there isn't any leaking between versions and avoids using possibily outdated/stale data.
