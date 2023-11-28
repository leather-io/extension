import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

import { GenericError, GenericErrorListItem } from '@app/components/generic-error/generic-error';

const helpTextList = [
  <GenericErrorListItem key={1} text="Please report issue to requesting app" />,
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
