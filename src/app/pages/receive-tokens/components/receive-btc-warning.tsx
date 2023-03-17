import { useNavigate } from 'react-router-dom';

import { Stack, Text } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { figmaTheme } from '@app/common/utils/figma-theme';
import { Link } from '@app/components/link';
import { WarningLabel } from '@app/components/warning-label';

interface ReceiveBtcModalWarningProps {
  accountIndex: number;
}

export function ReceiveBtcModalWarning({ accountIndex }: ReceiveBtcModalWarningProps) {
  const navigate = useNavigate();

  return (
    <WarningLabel width="100%">
      <Stack spacing="none">
        <Text color={figmaTheme.text} fontSize={1} fontWeight={500} mb="0">
          Do not deposit Ordinal inscriptions here
        </Text>
        <Link
          onClick={() => navigate(RouteUrls.ReceiveCollectible, { state: { accountIndex } })}
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
