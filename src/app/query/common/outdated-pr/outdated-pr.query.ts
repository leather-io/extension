import { Endpoints } from '@octokit/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { GITHUB_ORG, GITHUB_REPO } from '@shared/constants';
import { COMMIT_SHA, PR_NUMBER } from '@shared/environment';
import { isDefined } from '@shared/utils';

type PrInfoResp = Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}']['response'];

async function getPullRequestDetails(pr: string): Promise<PrInfoResp> {
  return axios.get(`https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/pulls/${pr}`);
}

export function useIsOutdatedPrQuery() {
  return useQuery({
    enabled: isDefined(PR_NUMBER) && isDefined(COMMIT_SHA),
    queryKey: ['outdated-pr-', PR_NUMBER],
    async queryFn() {
      return getPullRequestDetails(PR_NUMBER ?? '');
    },
    select(resp) {
      return resp.data.head.sha.startsWith(COMMIT_SHA ?? '');
    },
  });
}
