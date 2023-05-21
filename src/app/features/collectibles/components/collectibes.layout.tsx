import { Flex, Grid, Spinner, color } from '@stacks/ui';

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
            <Spinner color={color('text-caption')} opacity={0.5} size="16px" />
          ) : (
            <RefreshIcon cursor="pointer" onClick={() => onRefresh()} />
          )}
        </Flex>
        {subHeader}
      </Flex>
      <Grid
        gap="base"
        rowGap="extra-loose"
        templateColumns={[
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
