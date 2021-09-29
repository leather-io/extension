import React, { useMemo } from 'react';
import { Box, Stack, SlideFade, Flex } from '@stacks/ui';
import type { StackProps } from '@stacks/ui';
import { TokenAssets } from '@components/popup/token-assets';

import { Caption } from '@components/typography';
import { NoActivityIllustration } from '@components/vector/no-activity';
import { Tabs } from '@components/tabs';

import { useAccountActivity } from '@store/accounts/account.hooks';
import { useHomeTabs } from '@common/hooks/use-home-tabs';
import { HomePageSelectors } from '@tests/page-objects/home-page.selectors';
import { useCurrentAccountLocalTxids } from '@store/accounts/account-activity.hooks';
import { TransactionList } from '@components/popup/transaction-list';
import { createTxDateFormatList } from '@common/group-txs-by-date';
import { LocalTxList } from '@features/local-transaction-activity/local-tx-list';
import { LoadingSpinner } from '@components/loading-spinner';

function EmptyActivity() {
  return (
    <Stack py="extra-loose" spacing="extra-loose" justifyContent="center" alignItems="center">
      <Box mx="auto">
        <NoActivityIllustration />
      </Box>

      <Caption maxWidth="23ch" textAlign="center">
        No activity yet.
      </Caption>
    </Stack>
  );
}

const ActivityList = () => {
  const transactions = useAccountActivity();
  const groupedTxs = useMemo(
    () => (transactions ? createTxDateFormatList(transactions) : []),
    [transactions]
  );
  const txids = useCurrentAccountLocalTxids();
  const hasTxs = txids.length > 0 || transactions.length > 0;
  return !hasTxs ? (
    <EmptyActivity />
  ) : (
    <>
      {txids.length > 0 && <LocalTxList txids={txids} />}
      {transactions.length > 0 && <TransactionList txsByDate={groupedTxs} />}
    </>
  );
};

export function BalancesAndActivity(props: StackProps) {
  const { activeTab, setActiveTab } = useHomeTabs();
  return (
    <Stack flexGrow={1} spacing="extra-loose" {...props}>
      <Tabs
        tabs={[
          { slug: 'balances', label: 'Balances' },
          { slug: 'activity', label: 'Activity' },
        ]}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />

      <Flex position="relative" flexGrow={1}>
        {activeTab === 0 && (
          <React.Suspense fallback={<LoadingSpinner pb="72px" />}>
            <SlideFade in={activeTab === 0}>
              {styles => (
                <TokenAssets
                  data-testid={HomePageSelectors.BalancesList}
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  style={styles}
                />
              )}
            </SlideFade>
          </React.Suspense>
        )}
        {activeTab === 1 && (
          <React.Suspense fallback={<LoadingSpinner pb="72px" />}>
            <SlideFade in={activeTab === 1}>
              {styles => (
                <Box position="absolute" top={0} left={0} width="100%" style={styles}>
                  <ActivityList />
                </Box>
              )}
            </SlideFade>
          </React.Suspense>
        )}
      </Flex>
    </Stack>
  );
}
