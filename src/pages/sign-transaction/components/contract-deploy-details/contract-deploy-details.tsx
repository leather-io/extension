import { useState } from 'react';
import { CodeBlock, Stack, color, BoxProps } from '@stacks/ui';

import { usePendingTransaction } from '@store/transactions/transaction.hooks';
import { Prism } from '@common/clarity-prism';
import { useWallet } from '@common/hooks/use-wallet';
import { Caption, Title } from '@components/typography';
import { Divider } from '@components/divider';
import { ContractPreview } from '@pages/sign-transaction/components/contract-preview';
import { Row } from '@pages/sign-transaction/components/row';
import { AttachmentRow } from '@pages/sign-transaction/components/attachment-row';

function ContractCodeSection(): JSX.Element | null {
  const pendingTransaction = usePendingTransaction();
  const { currentAccount, currentAccountStxAddress } = useWallet();

  if (
    !pendingTransaction ||
    pendingTransaction.txType !== 'smart_contract' ||
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
      code={pendingTransaction.codeBody}
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
  const pendingTransaction = usePendingTransaction();
  const { currentAccount, currentAccountStxAddress } = useWallet();
  const [tab, setTab] = useState<'details' | 'code'>('details');

  if (
    !pendingTransaction ||
    pendingTransaction.txType !== 'smart_contract' ||
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
            contractName={pendingTransaction.contractName}
          />
          <Stack spacing="base-loose" divider={<Divider />}>
            {currentAccountStxAddress && (
              <Row name="Contract address" value={currentAccountStxAddress} type="Principal" />
            )}
            <Row name="Contract name" value={pendingTransaction.contractName} type="String" />
            {pendingTransaction.attachment && <AttachmentRow />}
          </Stack>
        </Stack>
      ) : (
        <ContractCodeSection />
      )}
    </Stack>
  );
}
