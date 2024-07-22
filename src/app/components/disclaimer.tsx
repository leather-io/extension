import { Box, BoxProps, styled } from 'leather-styles/jsx';

import { Link } from '@leather.io/ui';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';

interface DisclaimerProps extends BoxProps {
  disclaimerText: string;
  learnMoreUrl?: string;
}
export function Disclaimer({ disclaimerText, learnMoreUrl, ...props }: DisclaimerProps) {
  return (
    <Box {...props}>
      <styled.span textStyle="caption.01">
        {disclaimerText}
        {learnMoreUrl ? (
          <Link display="inline" fontSize="14px" onClick={() => openInNewTab(learnMoreUrl)}>
            {' '}
            Learn more
          </Link>
        ) : null}
        {learnMoreUrl ? '.' : null}
      </styled.span>
    </Box>
  );
}
