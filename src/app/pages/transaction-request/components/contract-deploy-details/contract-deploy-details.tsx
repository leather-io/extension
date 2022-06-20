import { useState } from 'react';
import { CodeBlock, Stack, color, BoxProps } from '@stacks/ui';

import { Prism } from '@app/common/clarity-prism';
import { useWallet } from '@app/common/hooks/use-wallet';
import { Caption, Title } from '@app/components/typography';
import { Divider } from '@app/components/divider';
import { ContractPreview } from '@app/pages/transaction-request/components/contract-preview';
import { Row } from '@app/pages/transaction-request/components/row';
import { AttachmentRow } from '@app/pages/transaction-request/components/attachment-row';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

function ContractCodeSection(): JSX.Element | null {
  const transactionRequest = useTransactionRequestState();
  const { currentAccount, currentAccountStxAddress } = useWallet();

  if (
    !transactionRequest ||
    transactionRequest.txType !== 'smart_contract' ||
    !currentAccount ||
    !currentAccountStxAddress
  ) {
    return null;
  }

  return (
    <CodeBlock
      maxWidth="379px"
      overflow="auto"
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      backgroundColor="ink.1000"
      width="100%"
      code={transactionRequest.codeBody}
      Prism={Prism as any}
    />
  );
}

interface TabButtonProps extends BoxProps {
  isActive: boolean;
}

function TabButton(props: TabButtonProps): JSX.Element {
  const { isActive, ...rest } = props;

  return (
    <Caption
      as="button"
      border={0}
      borderRadius="8px"
      px="base"
      py="base"
      bg={isActive ? color('bg-4') : 'transparent'}
      fontWeight={isActive ? 600 : 500}
      {...rest}
    />
  );
}

export function ContractDeployDetails(): JSX.Element | null {
  const transactionRequest = useTransactionRequestState();
  const { currentAccount, currentAccountStxAddress } = useWallet();
  const [tab, setTab] = useState<'details' | 'code'>('details');

  if (
    !transactionRequest ||
    transactionRequest.txType !== 'smart_contract' ||
    !currentAccount ||
    !currentAccountStxAddress
  ) {
    return null;
  }

  return (
    <Stack spacing="loose">
      <Stack spacing="0" isInline>
        <TabButton onClick={() => setTab('details')} isActive={tab === 'details'}>
          Details
        </TabButton>
        <TabButton onClick={() => setTab('code')} isActive={tab === 'code'}>
          Code
        </TabButton>
      </Stack>
      {tab === 'details' ? (
        <Stack
          spacing="loose"
          border="4px solid"
          borderColor={color('border')}
          borderRadius="12px"
          py="extra-loose"
          px="base-loose"
        >
          <Title as="h2" fontWeight="500">
            Contract deploy details
          </Title>
          <ContractPreview
            contractAddress={currentAccountStxAddress}
            contractName={transactionRequest.contractName}
          />
          <Stack spacing="base-loose" divider={<Divider />}>
            {currentAccountStxAddress && (
              <Row name="Contract address" value={currentAccountStxAddress} type="Principal" />
            )}
            <Row name="Contract name" value={transactionRequest.contractName} type="String" />
            {transactionRequest.attachment && <AttachmentRow />}
          </Stack>
        </Stack>
      ) : (
        <ContractCodeSection />
      )}
    </Stack>
  );
}
