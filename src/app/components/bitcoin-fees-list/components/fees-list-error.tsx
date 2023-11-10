import { useNavigate } from 'react-router-dom';

import { Box } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { GenericError, GenericErrorListItem } from '@app/components/generic-error/generic-error';

const body = 'Check balance and try again';
const helpTextList = [<GenericErrorListItem key={1} text="Possibly caused by api issues" />];
const title = 'Unable to calculate fees';

export function FeesListError() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" px={['unset', 'space.05']} py="space.04" width="100%">
      <GenericError
        body={body}
        helpTextList={helpTextList}
        onClose={() => navigate(RouteUrls.SendCryptoAsset)}
        title={title}
      />
    </Box>
  );
}
