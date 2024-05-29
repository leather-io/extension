import { Link } from '@leather-wallet/ui';
import { Box, BoxProps, styled } from 'leather-styles/jsx';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';

interface DisclaimerProps extends BoxProps {
  disclaimerText: string;
  learnMoreUrl?: string;
}
export function Disclaimer({ disclaimerText, learnMoreUrl, ...props }: DisclaimerProps) {
  return (
    <Box lineHeight="1.4" {...props}>
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
