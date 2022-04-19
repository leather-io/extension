import { ReactNode } from 'react';

import { Header } from '@app/components/header';
import { useRouteHeader } from '@app/common/hooks/use-route-header';

import { GenericErrorLayout } from './generic-error.layout';

interface ErrorProps {
  body: string;
  helpTextList: ReactNode[];
  onClose?(): void;
  title: string;
}
export function GenericError(props: ErrorProps) {
  const { body, helpTextList, onClose = () => window.close(), title } = props;

  useRouteHeader(<Header hideActions />);

  return (
    <GenericErrorLayout body={body} helpTextList={helpTextList} onClose={onClose} title={title} />
  );
}
