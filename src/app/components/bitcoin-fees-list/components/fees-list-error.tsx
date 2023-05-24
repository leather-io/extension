import { useNavigate } from 'react-router-dom';

import { Box, Text } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { GenericError } from '@app/components/generic-error/generic-error';

const body = 'Check balance and try again';
const helpTextList = [
  <Box as="li" mt="base" key={1}>
    <Text>Possibly caused by api issues</Text>
  </Box>,
];
const title = 'Unable to calculate fees';

export function FeesListError() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" px={['unset', 'loose']} py="base" width="100%">
      <GenericError
        body={body}
        helpTextList={helpTextList}
        onClose={() => navigate(RouteUrls.SendCryptoAsset)}
        title={title}
      />
    </Box>
  );
}
