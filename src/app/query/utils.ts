import { wrappedFetch } from '@app/common/api/fetch-wrapper';

interface FetchDataArgs {
  errorMsg: string;
  url: string;
}

export async function fetchData({ errorMsg, url }: FetchDataArgs) {
  const response = await wrappedFetch(url);
  if (!response.ok) {
    throw new Error(errorMsg);
  }
  return response.json();
}
