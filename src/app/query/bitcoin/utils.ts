interface FetchBitcoinDataArgs {
  errorMsg: string;
  url: string;
}
// REFACTOR: move outside of bitcoin folder & rename, doesn't have any bitcoin
// specific functionality
export async function fetchBitcoinData({ errorMsg, url }: FetchBitcoinDataArgs) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(errorMsg);
  }
  return response.json();
}
