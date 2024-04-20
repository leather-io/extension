import { ReactNode } from 'react';

import { FlexProps, styled } from 'leather-styles/jsx';

import { closeWindow } from '@shared/utils';

import { GenericErrorLayout } from './generic-error.layout';

export function GenericErrorListItem({ text }: { text: ReactNode }) {
  return <styled.li mt="space.04">{text}</styled.li>;
}

interface GenericErrorProps extends FlexProps {
  body: string;
  helpTextList?: ReactNode[];
  onClose?(): void;
  title: string;
}

export function GenericError(props: GenericErrorProps) {
  const { body, helpTextList, onClose = () => closeWindow(), title, ...rest } = props;

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
