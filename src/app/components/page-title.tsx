import { ReactNode } from 'react';
import { BoxProps } from '@stacks/ui';

import { Title } from '@app/components/typography';

interface PageTitleProps extends BoxProps {
  children?: ReactNode;
  isCentered?: boolean;
  isWelcomePage?: boolean;
}
export function PageTitle(props: PageTitleProps) {
  const { children, isCentered, isWelcomePage, ...rest } = props;
  return (
    <Title
      fontSize={['32px', '48px', isWelcomePage ? '64px' : '48px']}
      lineHeight={['137%', '125%', isWelcomePage ? '112%' : '125%']}
      maxWidth={['264px', 'unset', '500px']}
      textAlign={['left', isCentered ? 'center' : 'left', null]}
      {...rest}
    >
      {children}
    </Title>
  );
}
