import { Stack } from '@stacks/ui';

import { Caption } from '@app/components/typography';
import NoActivity from '@assets/images/no-activity.png';

export function NoAccountActivity() {
  return (
    <Stack py="extra-loose" spacing="extra-loose" justifyContent="center" alignItems="center">
      <img src={NoActivity} width="120px" />
      <Caption maxWidth="23ch" textAlign="center">
        No activity yet.
      </Caption>
    </Stack>
  );
}
