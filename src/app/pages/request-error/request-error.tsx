import { useLocation } from 'react-router-dom';

import { styled } from 'leather-styles/jsx';
import get from 'lodash.get';

import { GenericError } from '@app/components/generic-error/generic-error';

const helpTextList = [
  <styled.li mt="space.04" key={1}>
    Please report issue to requesting app
  </styled.li>,
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
