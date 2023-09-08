// #4164 FIXME migrate Spinner
import { Spinner } from '@stacks/ui';
import { Flex, Grid } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { RefreshIcon } from '@app/components/icons/refresh-icon';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { Caption } from '@app/components/typography';

interface CollectiblesLayoutProps {
  title: string;
  isLoading: boolean;
  isLoadingMore?: boolean;
  onRefresh(): void;
  subHeader?: React.ReactNode;
  children: React.ReactNode;
}
export function CollectiblesLayout(props: CollectiblesLayoutProps) {
  const { title, isLoading, onRefresh, subHeader, isLoadingMore, children } = props;
  return (
    <>
      <Flex flexDirection="row" justifyContent="space-between" flex={1}>
        <Flex columnGap="8px">
          <Caption>{title}</Caption>
          {isLoading ? (
            <Spinner color={token('colors.accent.text-subdued')} opacity={0.5} size="16px" />
          ) : (
            <RefreshIcon cursor="pointer" onClick={() => onRefresh()} />
          )}
        </Flex>
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
