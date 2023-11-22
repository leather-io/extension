import { Flex, Grid, HStack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { LoadingSpinner } from '@app/components/loading-spinner';
import { RefreshIcon } from '@app/ui/components/icons/refresh-icon';
import { Spinner } from '@app/ui/components/spinner';

interface CollectiblesLayoutProps {
  title: string;
  isLoading: boolean;
  isLoadingMore?: boolean;
  onRefresh(): void;
  subHeader?: React.ReactNode;
  children: React.ReactNode;
}
export function CollectiblesLayout({
  title,
  isLoading,
  onRefresh,
  subHeader,
  isLoadingMore,
  children,
}: CollectiblesLayoutProps) {
  return (
    <>
      <Flex flexDirection="row" justifyContent="space-between" flex={1}>
        <HStack columnGap="space.02">
          <styled.span textStyle="label.01">{title}</styled.span>
          {isLoading ? (
            <Spinner color={token('colors.accent.text-primary')} opacity={0.5} size="16px" />
          ) : (
            <RefreshIcon cursor="pointer" onClick={() => onRefresh()} />
          )}
        </HStack>
        {subHeader}
      </Flex>
      <Grid
        gap="space.04"
        rowGap="space.06"
        gridTemplateColumns={[
          'repeat(auto-fill, minmax(164px, 1fr))',
          'repeat(auto-fill, minmax(184px, 1fr))',
        ]}
      >
        {children}
      </Grid>
      {isLoadingMore && <LoadingSpinner />}
    </>
  );
}
