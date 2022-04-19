import { Box } from '@stacks/ui';

import { GenericError } from '@app/components/generic-error/generic-error';

const body = `The requesting origin has not been authorized. This may happen if you've sign in to this app before using another account.`;
const helpTextList = [
  <Box as="li" mt="base">
    Sign out of the app and sign back in to re-authenticate into the application. This should help
    you successfully sign your transaction with the Hiro Wallet.
  </Box>,
];
const title = 'Unauthorized request';

export function UnauthorizedRequest() {
  return <GenericError body={body} helpTextList={helpTextList} title={title} />;
}
