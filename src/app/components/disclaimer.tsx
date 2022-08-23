import { Box } from '@stacks/ui';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Link } from '@app/components/link';
import { Caption } from '@app/components/typography';

interface DisclaimerProps {
  disclaimerText: string;
  learnMoreUrl: string;
}
export function DisclaimerLayout({ disclaimerText, learnMoreUrl }: DisclaimerProps) {
  return (
    <Box>
      <Caption>
        {disclaimerText}
        <Link display="inline" fontSize="14px" onClick={() => openInNewTab(learnMoreUrl)}>
          {' '}
          Learn more
        </Link>
        .
      </Caption>
    </Box>
  );
}
