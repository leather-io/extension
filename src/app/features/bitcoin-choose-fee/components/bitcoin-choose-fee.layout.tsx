import { Flex } from '@stacks/ui';

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
    <Flex alignItems="center" p="extra-loose" spacing="base" width="100%">
      {children}
    </Flex>
  );
}
