export interface MagicSupplier {
  controller: string;
  inboundFee: number;
  outboundFee: number;
  outboundBaseFee: number;
  inboundBaseFee: number;
  publicKey: string;
  funds: number;
  id: number;
}

export type MagicSupplierWithCapacity = MagicSupplier & { btc: string; btcAddress: string };

export interface MagicInboundSwap {
  id: string;
  secret: string;
  createdAt: number;
  swapperId: number | undefined;
  supplier: MagicSupplier;
  expiration: number;
  publicKey: string;
  amount: string;
}

export interface MagicOutboundSwap {
  test: string;
}

export type MagicSwap =
  | ({ direction: 'inbound' } & MagicInboundSwap)
  | ({ direction: 'outbound' } & MagicInboundSwap);
