import NoActivity from '@assets/images/no-activity.png';
import { Caption } from '@leather-wallet/ui';
import { Stack } from 'leather-styles/jsx';

export function NoAccountActivity() {
  return (
    <Stack gap="space.06" justifyContent="center" alignItems="center">
      <img src={NoActivity} width="120px" />
      <Caption maxWidth="23ch" textAlign="center">
        No activity yet
      </Caption>
    </Stack>
  );
}
