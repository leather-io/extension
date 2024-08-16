import { Flex, FlexProps } from 'leather-styles/jsx';

import { Card } from '@app/components/layout';
import { LoadingSpinner } from '@app/components/loading-spinner';

interface BitcoinChooseFeeLayoutProps extends FlexProps {
  children: React.JSX.Element;
  isLoading: boolean;
}

export function BitcoinChooseFeeLayout({
  children,
  isLoading,
  ...rest
}: BitcoinChooseFeeLayoutProps) {
  if (isLoading) {
    return (
      <Flex py="108px" justifyContent="center" alignItems="center" width="100%">
        <LoadingSpinner />
      </Flex>
    );
  }

  return (
    <Card px="space.05" py="space.06" {...rest}>
      {children}
    </Card>
  );
}
