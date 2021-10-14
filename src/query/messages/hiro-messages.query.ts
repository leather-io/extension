import { GITHUB_ORG, GITHUB_PRIMARY_BRANCH, GITHUB_REPO } from '@common/constants';
import { useQuery } from 'react-query';

export interface HiroMessage {
  title: string;
  text: string;
  purpose: 'error' | 'info' | 'warning';
  publishedAt: string;
  dismissible: boolean;
  learnMoreUrl?: string;
}

type HiroMessagesResponse = Record<string, HiroMessage[]>;

const githubCommsConfigRawUrl = `https://raw.githubusercontent.com/${GITHUB_ORG}/${GITHUB_REPO}/${GITHUB_PRIMARY_BRANCH}/config/wallet-comms.json`;

async function fetchHiroMessages(): Promise<HiroMessagesResponse> {
  return fetch(githubCommsConfigRawUrl).then(msg => msg.json());
}

export function useHiroMessages() {
  const { data } = useQuery(['walletComms'], fetchHiroMessages, {
    // As we're fetching from Github, a third-party, we want
    // to avoid any unnecessary stress on their services, so
    // we use quite slow stale/retry times
    staleTime: 1000 * 60 * 10,
    retryDelay: 1000 * 60,
  });
  return data;
}
