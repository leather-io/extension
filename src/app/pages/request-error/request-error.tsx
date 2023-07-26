import { useLocation } from 'react-router-dom';

import { Box, Text } from '@stacks/ui';
import get from 'lodash.get';

import { GenericError } from '@app/components/generic-error/generic-error';

const helpTextList = [
  <Box as="li" mt="base" key={1}>
    <Text>Please report issue to requesting app</Text>
  </Box>,
];

function useRequestErrorState() {
  const location = useLocation();
  const message = get(location.state, 'message') as string;
  const title = get(location.state, 'title') as string;

  return { message, title };
}

export function RequestError() {
  const { message, title } = useRequestErrorState();

  return <GenericError body={message} helpTextList={helpTextList} title={title} />;
}
