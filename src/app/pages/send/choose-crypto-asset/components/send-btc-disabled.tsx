import { FiExternalLink } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Box, Stack, Text } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { GenericError } from '@app/components/generic-error/generic-error';

const body = 'Sending bitcoin is temporarily disabled';
const helpTextList = [
  <Box as="li" mt="base">
    <Stack alignItems="center" isInline>
      <Text>Learm more on Twitter at @hirowallet</Text>
      <Box as="button" onClick={() => openInNewTab('https://mobile.twitter.com/hirowallet')}>
        <FiExternalLink />
      </Box>
    </Stack>
  </Box>,
];
const title = 'Temporarily disabled';

export function SendBtcDisabled() {
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
