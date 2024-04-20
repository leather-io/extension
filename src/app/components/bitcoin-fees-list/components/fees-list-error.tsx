import { useNavigate } from 'react-router-dom';

import { Box } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { GenericError } from '@app/components/generic-error/generic-error';

const body = 'Please set a custom fee';
const title = 'Unable to calculate fees';

export function FeesListError() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" px={['unset', 'space.05']} py="space.04" width="100%">
      <GenericError body={body} onClose={() => navigate(RouteUrls.SendCryptoAsset)} title={title} />
    </Box>
  );
}
