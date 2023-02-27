import { useNavigate } from 'react-router-dom';

import { Stack, Text } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { Link } from '@app/components/link';
import { WarningLabel } from '@app/components/warning-label';

export function ReceiveBtcModalWarning() {
  const navigate = useNavigate();

  return (
    <WarningLabel width="100%">
      <Stack spacing="none">
        <Text color="#242629" fontSize={1} fontWeight={500} mb="0">
          Do not deposit Ordinal inscriptions here
        </Text>
        <Link
          onClick={() => navigate(RouteUrls.ReceiveCollectible)}
          color="blue"
          display="inline-block"
          fontSize={1}
        >
          Use the address created for collectibles
        </Link>
      </Stack>
    </WarningLabel>
  );
}
