import { useCurrentNetworkState } from "@app/store/networks/networks.hooks";
import { useMemo } from "react";
import { getBitcoinNetwork } from "../network";

export function useBitcoinNetwork() {
  const network = useCurrentNetworkState();

  const bitcoinNetwork = useMemo(() => {
    return getBitcoinNetwork(network.id)
  },
  [network]);

  return bitcoinNetwork;
}
