export function useSwapFeature() {
  return {
    swapIsEnabled: !!process.env.SWAP_ENABLED
  };
}
