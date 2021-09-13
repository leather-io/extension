---
'@stacks/wallet-web': minor
---

This update removes a lot of the code we implemented to determine if a fungible token asset can be transferred/conforms to [SIP-010](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md), and in place we now rely on the new [token metadata endpoints]https://blockstack.github.io/stacks-blockchain-api/#tag/tokens in the stacks-blockchain-api.

**NOTICE: This update removes the ability to transfer certain fungible tokens that conformed to an older version of SIP-010 (with no memo).**
