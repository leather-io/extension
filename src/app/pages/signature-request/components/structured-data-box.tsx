import { useEffect, useState } from 'react';
import { sha256 } from 'sha.js';
import { Box, color, Stack, Text } from '@stacks/ui';
import {
  ChainID,
  ClarityValue,
  cvToString,
  encodeStructuredData,
  TupleCV,
} from '@stacks/transactions';

import { whenChainId } from '@app/common/utils';
import { ClarityType } from '@stacks/transactions/dist/esm/clarity';
import { ClarityValueListDisplayer } from './clarity-value-list';
import { HashDrawer } from './hash-drawer';

function cvToDisplay(cv: ClarityValue): string {
  return cvToString(cv).replaceAll('"', '');
}

function chainIdToDisplay(chainIdCv: ClarityValue): string {
  if (chainIdCv.type !== ClarityType.UInt) return '';
  const chainIdString = cvToString(chainIdCv);
  const chainId = parseInt(chainIdString.replace('u', ''));
  if (!Object.values(ChainID).includes(chainId)) return '';

  return whenChainId(chainId as ChainID)({
    [ChainID.Testnet]: 'Testnet',
    [ChainID.Mainnet]: 'Mainnet',
  });
}

export function StructuredDataBox(props: { message: ClarityValue; domain: TupleCV }) {
  const { message, domain } = props;

  const [hash, setHash] = useState<string | undefined>();
  const [domainName, setDomainName] = useState<string | undefined>();
  const [domainVersion, setDomainVersion] = useState<string | undefined>();
  const [domainChainName, setDomainChainName] = useState<string | undefined>();

  useEffect(() => {
    const messageHash = new sha256()
      .update(encodeStructuredData({ message, domain }))
      .digest('hex');
    setHash(messageHash);
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
