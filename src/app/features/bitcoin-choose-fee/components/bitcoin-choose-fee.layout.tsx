import { Flex } from 'leaf-styles/jsx';

import { LoadingSpinner } from '@app/components/loading-spinner';

interface BitcoinChooseFeeLayoutProps {
  children: React.JSX.Element;
  isLoading: boolean;
}

export function BitcoinChooseFeeLayout({ children, isLoading }: BitcoinChooseFeeLayoutProps) {
  if (isLoading) {
    return (
      <Flex py="108px" justifyContent="center" alignItems="center" width="100%">
        <LoadingSpinner />
      </Flex>
    );
  }
  return (
    <Flex
      px="space.05"
      py="space.06"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      flex="1 0 0"
      alignSelf="stretch"
    >
      {children}
    </Flex>
  );
}
