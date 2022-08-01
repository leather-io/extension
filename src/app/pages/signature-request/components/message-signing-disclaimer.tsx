import { Box } from '@stacks/ui';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Link } from '@app/components/link';
import { Caption } from '@app/components/typography';

interface DisclaimerProps {
  appName?: string;
}
export function Disclaimer({ appName }: DisclaimerProps) {
  return (
    <Box>
      <Caption>
        By signing this message, you are authorizing {appName ?? 'the app'} to do something specific
        on your behalf. Only sign messages that you understand from apps that you trust.
        <Link
          display="inline"
          fontSize="14px"
          onClick={() => openInNewTab('https://docs.hiro.so/build-apps/message-signing')}
        >
          {' '}
          Learn more
        </Link>
        .
      </Caption>
    </Box>
  );
}
