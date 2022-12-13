import { useEffect, useState } from 'react';

import { ClarityValue } from '@stacks/transactions';
import { Box, Stack, Text, color } from '@stacks/ui';

import { StructuredMessageDataDomain } from '@shared/signature/signature-types';

import {
  chainIdToDisplay,
  cvToDisplay,
  deriveStructuredMessageHash,
} from '@app/features/ledger/flows/message-signing/message-signing.utils';

import { ClarityValueListDisplayer } from './clarity-value-list';
import { HashDrawer } from './hash-drawer';

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
        borderColor={color('border')}
        borderRadius="20px"
        backgroundColor={color('border')}
      >
        <Box overflowX="scroll" py="loose" borderRadius="16px" background="white">
          <Box fontSize="14px" lineHeight="1.7" px="loose">
            <h2>
              <strong>{domainName}</strong>{' '}
              <Text color={color('text-caption')}>
                {domainVersion} {domainChainName}
              </Text>
            </h2>
            <hr style={{ marginTop: '5px', marginBottom: '5px' }} />
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
