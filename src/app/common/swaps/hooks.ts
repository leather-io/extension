export function useSwapFeature() {
  return {
    isSwapEnabled: !!process.env.SWAP_ENABLED
  };
}
