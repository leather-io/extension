import { ReactNode } from 'react';
import { BoxProps } from '@stacks/ui';

import { Title } from '@app/components/typography';

interface PageTitleProps extends BoxProps {
  children?: ReactNode;
  isHeadline?: boolean;
}
export function PageTitle(props: PageTitleProps) {
  const { children, fontSize, isHeadline, ...rest } = props;
  return (
    <Title
      fontSize={fontSize || ['32px', '48px', isHeadline ? '64px' : '48px']}
      lineHeight={['137%', '125%', isHeadline ? '112%' : '125%']}
      maxWidth={['264px', 'unset', '500px']}
      {...rest}
    >
      {children}
    </Title>
  );
}
