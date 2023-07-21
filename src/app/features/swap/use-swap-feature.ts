export const useSwapFeature = () => {
  return {
    swapIsEnabled: !!process.env.SWAP_ENABLED
  };
}
