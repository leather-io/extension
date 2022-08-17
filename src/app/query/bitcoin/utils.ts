interface FetchBitcoinDataArgs {
  errorMsg: string;
  url: string;
}
export async function fetchBitcoinData({ errorMsg, url }: FetchBitcoinDataArgs) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(errorMsg);
  }
  return response.json();
}
