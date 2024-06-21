import type { Endpoints } from '@octokit/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { isDefined } from '@leather.io/utils';

import { GITHUB_ORG, GITHUB_REPO } from '@shared/constants';
import { COMMIT_SHA, PR_NUMBER } from '@shared/environment';

type PrDetailsResp = Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}']['response']['data'];

async function getPullRequestDetails(pr: string): Promise<PrDetailsResp> {
  const resp = await axios.get(
    `https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/pulls/${pr}`
  );
  return resp.data;
}

function usePullRequestDetailsQuery() {
  return useQuery({
    enabled: isDefined(PR_NUMBER) && isDefined(COMMIT_SHA),
    queryKey: ['pull-request-details', PR_NUMBER],
    async queryFn() {
      return getPullRequestDetails(PR_NUMBER ?? '');
    },
  });
}

export function useIsLatestPullRequestBuild() {
  const { data: pullRequest } = usePullRequestDetailsQuery();
  if (!pullRequest) return { isLatestBuild: true };
  return {
    // If the latest commit SHA on the PR is not the same one used for this build,
    // we can assume it's outdated
    isLatestBuild: pullRequest.head.sha.startsWith(COMMIT_SHA ?? ''),
    pullRequestLink: pullRequest.html_url,
  };
}
