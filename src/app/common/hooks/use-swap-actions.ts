import { useAppDispatch } from "@app/store";
import { useMemo } from "react";
import { Swap } from "../swaps";
import { swapsActions } from "@app/store/swap";

export function useSwapActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      createSwap(swap: Swap) {
        return dispatch(swapsActions.createSwap(swap));
      }
    }),
    [dispatch]
  )
}
