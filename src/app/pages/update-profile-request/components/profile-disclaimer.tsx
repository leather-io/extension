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
        {appName ?? 'The app'} requested to update your public profile.
        The update will be published, however, some other apps might have still cached old values.

        <Link
          display="inline"
          fontSize="14px"
          onClick={() => openInNewTab('https://docs.hiro.so/build-apps/transaction-signing#get-the-users-stacks-address')}
        >
          {' '}
          Learn more
        </Link>
        .
      </Caption>
    </Box>
  );
}
