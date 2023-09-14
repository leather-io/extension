import { ReactNode } from 'react';

import { FlexProps } from 'leather-styles/jsx';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';

import { GenericErrorLayout } from './generic-error.layout';

interface GenericErrorProps extends FlexProps {
  body: string;
  helpTextList: ReactNode[];
  onClose?(): void;
  title: string;
}
export function GenericError(props: GenericErrorProps) {
  const { body, helpTextList, onClose = () => window.close(), title, ...rest } = props;

  useRouteHeader(<Header hideActions />);

  return (
    <GenericErrorLayout
      body={body}
      helpTextList={helpTextList}
      onClose={onClose}
      title={title}
      {...rest}
    />
  );
}
