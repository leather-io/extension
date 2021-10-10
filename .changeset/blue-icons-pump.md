---
'@stacks/wallet-web': patch
---

This fixes a small bug where if a serialized clarity value is passed to deserializeCV that is prefixed with `0x` it will error out.
