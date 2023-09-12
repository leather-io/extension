import { SwapFormValues } from "./hooks/use-swap";

export enum SwapType {
  MagicSwapInbound = 'MAGIC_SWAP_INBOUND',
  MagicSwapOutbound = 'MAGIC_SWAP_INBOUND',
  Unsupported = 'UNSUPPORTED',
}

export function getSwapType(swapFormValues: SwapFormValues) {
  let swapType: SwapType;

  const fromAssetSymbol = swapFormValues.swapAssetFrom?.balance.symbol;
  const toAssetSymbol = swapFormValues.swapAssetTo?.balance.symbol;

  if (fromAssetSymbol === 'BTC' && toAssetSymbol === 'xBTC') {
    swapType = SwapType.MagicSwapInbound;
  } else if (fromAssetSymbol === 'xBTC' && toAssetSymbol === 'BTC') {
    swapType = SwapType.MagicSwapOutbound;
  } else {
    swapType = SwapType.Unsupported;
  }

  return swapType;
}
