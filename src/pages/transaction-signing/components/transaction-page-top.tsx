import React, { memo } from 'react';
import { useTransactionRequest } from '@store/transactions/requests.hooks';
import { useTransactionPageTitle } from '@pages/transaction-signing/hooks/use-transaction-page-title';
import { Stack } from '@stacks/ui';
import { Caption, Title } from '@components/typography';
import { useCurrentNetwork } from '@common/hooks/use-current-network';
import { getUrlHostname, getUrlPort } from '@common/utils';
import { useOrigin } from '@store/transactions/requests.hooks';

function addPortSuffix(url: string) {
  const port = getUrlPort(url);
  return port ? `:${port}` : '';
}

export const TransactionPageTop = memo(() => {
  const transactionRequest = useTransactionRequest();
  const origin = useOrigin();
  const pageTitle = useTransactionPageTitle();
  const network = useCurrentNetwork();
  if (!transactionRequest) return null;
  const appName = transactionRequest?.appDetails?.name;
  const originAddition = origin ? ` (${getUrlHostname(origin)})` : '';
  const testnetAddition = network.isTestnet
    ? ` using ${getUrlHostname(network.url)}${addPortSuffix(network.url)}`
    : '';
  const caption = appName ? `Requested by "${appName}"${originAddition}${testnetAddition}` : null;

  return (
    <Stack pt="extra-loose" spacing="base">
      <Title fontWeight="bold" as="h1">
        {pageTitle}
      </Title>
      {caption && <Caption wordBreak="break-word">{caption}</Caption>}
    </Stack>
  );
});
