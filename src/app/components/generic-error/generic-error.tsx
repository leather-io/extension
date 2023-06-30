import { ReactNode } from 'react';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';

import { GenericErrorLayout } from './generic-error.layout';

interface GenericErrorProps {
  body: string;
  helpTextList: ReactNode[];
  onClose?(): void;
  title: string;
}
export function GenericError(props: GenericErrorProps) {
  const { body, helpTextList, onClose = () => window.close(), title } = props;

  useRouteHeader(<Header hideActions />);

  return (
    <GenericErrorLayout body={body} helpTextList={helpTextList} onClose={onClose} title={title} />
  );
}
