import { useMemo } from 'react';
import { forwardRef } from 'react';

import { HTMLStyledProps, styled } from 'leather-styles/jsx';

import { BRANCH_NAME, COMMIT_SHA } from '@shared/environment';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useIsLatestPullRequestBuild } from '@app/query/common/outdated-pr/outdated-pr.query';

import { Tooltip } from './tooltip';

interface AppVersionLabelProps extends HTMLStyledProps<'span'> {
  isLatestVersion: boolean;
}
const AppVersionLabel = forwardRef<HTMLSpanElement, AppVersionLabelProps>(
  ({ children, isLatestVersion, ...props }: AppVersionLabelProps, ref) => (
    <styled.span
      ref={ref}
      textStyle="mono.02"
      marginRight="10px"
      mb="-4px"
      ml="tight"
      opacity={0.5}
      textDecoration={isLatestVersion ? 'none' : 'line-through'}
      {...props}
    >
      {children}
    </styled.span>
  )
);

export function AppVersion() {
  const { pullRequestLink, isLatestBuild } = useIsLatestPullRequestBuild();

  const version = useMemo(() => {
    switch (process.env.WALLET_ENVIRONMENT) {
      case 'development':
        return `dev@${BRANCH_NAME}`;
      case 'feature':
        return `${BRANCH_NAME}#${COMMIT_SHA?.slice(0, 8)}`;
      default:
        return `v${VERSION}`;
    }
  }, []);

  if (!isLatestBuild && process.env.WALLET_ENVIRONMENT === 'feature') {
    return (
      <Tooltip label="Outdated PR build, download the latest version">
        <AppVersionLabel
          isLatestVersion={false}
          cursor="pointer"
          onClick={() => openInNewTab(pullRequestLink ?? '')}
        >
          {version}
        </AppVersionLabel>
      </Tooltip>
    );
  }

  return <AppVersionLabel isLatestVersion>{version}</AppVersionLabel>;
}
