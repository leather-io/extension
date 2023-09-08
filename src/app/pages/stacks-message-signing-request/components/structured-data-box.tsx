import { useEffect, useState } from 'react';

import { ClarityValue } from '@stacks/transactions';
import { Stack } from 'leather-styles/jsx';
import { Box, Divider, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { StructuredMessageDataDomain } from '@shared/signature/signature-types';

import { SpaceBetween } from '@app/components/layout/space-between';
import {
  chainIdToDisplay,
  cvToDisplay,
  deriveStructuredMessageHash,
} from '@app/features/ledger/flows/stacks-message-signing/message-signing.utils';
import { HashDrawer } from '@app/features/message-signer/hash-drawer';

import { ClarityValueListDisplayer } from './clarity-value-list';

export function StructuredDataBox(props: {
  message: ClarityValue;
  domain: StructuredMessageDataDomain;
}) {
  const { message, domain } = props;

  const [hash, setHash] = useState<string | undefined>();
  const [domainName, setDomainName] = useState<string | undefined>();
  const [domainVersion, setDomainVersion] = useState<string | undefined>();
  const [domainChainName, setDomainChainName] = useState<string | undefined>();

  useEffect(() => {
    setHash(deriveStructuredMessageHash({ message, domain }));
  }, [message, domain]);

  useEffect(() => {
    setDomainName(cvToDisplay(domain.data.name));
    setDomainVersion(cvToDisplay(domain.data.version));
    setDomainChainName(chainIdToDisplay(domain.data['chain-id']));
  }, [domain]);

  if (!message) return null;

  return (
    <Box minHeight="260px">
      <Stack
        border="4px solid"
        paddingBottom={'8px'}
        borderColor={token('colors.accent.border-default')}
        borderRadius="20px"
        backgroundColor={token('colors.accent.border-default')}
      >
        <Box background="white" borderRadius="16px" overflowX="scroll" py="space.05">
          <Box fontSize="14px" lineHeight="1.7" px="space.05">
            <SpaceBetween>
              <styled.h2 textStyle="label.01">{domainName}</styled.h2>
              <styled.span lineHeight="1.5" textStyle="caption.02">
                {domainVersion} {domainChainName}
              </styled.span>
            </SpaceBetween>
            <Divider py="space.01" />
            <Box>
              <ClarityValueListDisplayer val={message} encoding={'tryAscii'} />
            </Box>
          </Box>
        </Box>
        {hash ? <HashDrawer hash={hash} /> : null}
      </Stack>
    </Box>
  );
}
