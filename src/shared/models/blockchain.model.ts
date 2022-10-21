export enum WalletBlockchains {
  bitcoin = 'bitcoin',
  stacks = 'stacks',
}

export type WalletChainTypes = keyof typeof WalletBlockchains;
