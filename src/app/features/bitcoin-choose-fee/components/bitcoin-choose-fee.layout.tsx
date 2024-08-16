import { Flex, FlexProps } from 'leather-styles/jsx';

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
  // PEte - is this just now a Card ???
  return (
    <Flex
      px="space.05"
      py="space.06"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      flex="1 0 0"
      alignSelf="stretch"
      border={{ base: 'unset', sm: 'default' }}
      rounded="lg"
      {...rest}
    >
      {children}
    </Flex>
  );
}
