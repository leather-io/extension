export const mockStacksTokenContract = `
(define-fungible-token connect-token)
(begin (ft-mint? connect-token u10000000 tx-sender))

(define-public (transfer
    (recipient principal)
    (amount uint)
  )
  (ok (ft-transfer? connect-token amount tx-sender recipient))
)

(define-public (faucet)
  (ok (ft-mint? connect-token u100 tx-sender))
)

(define-non-fungible-token hello-nft uint)
(begin (nft-mint? hello-nft u1 tx-sender))
(begin (nft-mint? hello-nft u2 tx-sender))
`;
