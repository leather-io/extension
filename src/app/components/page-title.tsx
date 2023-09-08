import { ReactNode } from 'react';

import { BoxProps } from 'leather-styles/jsx';

import { Title } from '@app/components/typography';

interface PageTitleProps extends BoxProps {
  children?: ReactNode;
  isHeadline?: boolean;
}
export function PageTitle(props: PageTitleProps) {
  const { children, isHeadline, ...rest } = props;

  return (
    <Title
      fontSize={['32px', '48px', isHeadline ? '64px' : '48px']}
      lineHeight={['137%', '125%', isHeadline ? '112%' : '125%']}
      maxWidth={['90%', '100%']}
      {...rest}
    >
      {children}
    </Title>
  );
}
