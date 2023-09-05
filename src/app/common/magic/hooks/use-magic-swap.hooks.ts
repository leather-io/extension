import { useInboundMagicSwap } from "./use-inbound-magic-swap.hooks";

export function useMagicSwap() {
  const { createInboundSwap } = useInboundMagicSwap();

  return {
    createInboundSwap,
    createOutboundSwap: () => {
      return;
    },
  };
}
