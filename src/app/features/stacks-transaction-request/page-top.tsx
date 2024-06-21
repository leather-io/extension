import { memo } from 'react';

import { TransactionRequestSelectors } from '@tests/selectors/requests.selectors';
import { Stack, styled } from 'leather-styles/jsx';

import { Flag } from '@leather.io/ui';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { addPortSuffix, getUrlHostname } from '@app/common/utils';
import { Favicon } from '@app/components/favicon';
import { useStacksTxPageTitle } from '@app/features/stacks-transaction-request/hooks/use-stacks-tx-page-title';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

function PageTopBase() {
  const transactionRequest = useTransactionRequestState();
  const { origin } = useDefaultRequestParams();
  const pageTitle = useStacksTxPageTitle();
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
      data-testid={TransactionRequestSelectors.TransactionRequestPage}
      mb="space.05"
      gap="space.04"
      width="100%"
    >
      <styled.h1 mb="space.04" textStyle="heading.03">
        {pageTitle}
      </styled.h1>
      {caption && (
        <Flag img={<Favicon origin={origin ?? ''} />} pl="space.02">
          <styled.span textStyle="label.02" wordBreak="break-word">
            {caption}
          </styled.span>
        </Flag>
      )}
    </Stack>
  );
}

export const PageTop = memo(PageTopBase);
