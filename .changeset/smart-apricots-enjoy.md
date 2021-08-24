---
'@stacks/wallet-web': patch
---

This fixes a rare bug where if an address has received more transactions than we fetch for, it would assume it was a fresh account and return the incorrect nonce.
