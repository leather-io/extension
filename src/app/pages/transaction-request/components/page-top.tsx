import { memo } from 'react';

import { Stack } from '@stacks/ui';
import { TransactionSigningSelectors } from '@tests-legacy/page-objects/transaction-signing.selectors';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { addPortSuffix, getUrlHostname } from '@app/common/utils';
import { Caption, Title } from '@app/components/typography';
import { usePageTitle } from '@app/pages/transaction-request/hooks/use-page-title';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

function PageTopBase() {
  const transactionRequest = useTransactionRequestState();
  const { origin } = useDefaultRequestParams();
  const pageTitle = usePageTitle();
  const { isTestnet, chain } = useCurrentNetworkState();

  if (!transactionRequest) return null;

  const appName = transactionRequest?.appDetails?.name;
  const originAddition = origin ? ` (${getUrlHostname(origin)})` : '';
  const testnetAddition = isTestnet
    ? ` using ${getUrlHostname(chain.stacks.url)}${addPortSuffix(chain.stacks.url)}`
    : '';
  const caption = appName ? `Requested by "${appName}"${originAddition}${testnetAddition}` : null;

  return (
    <Stack
      data-testid={TransactionSigningSelectors.TxSigningPageContainer}
      pt="extra-loose"
      spacing="base"
    >
      <Title as="h1" fontWeight="bold">
        {pageTitle}
      </Title>
      {caption && <Caption wordBreak="break-word">{caption}</Caption>}
    </Stack>
  );
}

export const PageTop = memo(PageTopBase);
