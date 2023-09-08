import React from 'react';
import { FiArrowUpRight, FiCopy } from 'react-icons/fi';

// #4164 FIXME migrate useClipboard
import { useClipboard } from '@stacks/ui';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { BtcIcon } from '@app/components/icons/btc-icon';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';

interface BitcoinContractLockAmountProps {
  hoverLabel?: string;
  image?: React.JSX.Element;
  subtitle?: string;
  subValue?: string;
  subValueAction?(): void;
  title?: string;
  value: string;
}
export function BitcoinContractLockAmount({
  hoverLabel,
  image,
  subtitle,
  subValue,
  subValueAction,
  title,
  value,
}: BitcoinContractLockAmountProps) {
  const { onCopy, hasCopied } = useClipboard(hoverLabel ?? '');

  return (
    <Flag img={image || <BtcIcon />} align="middle" width="100%">
      <SpaceBetween>
        <styled.span textStyle="label.01">{title ? title : 'BTC'}</styled.span>
        <styled.span textStyle="label.01">{value}</styled.span>
      </SpaceBetween>
      <SpaceBetween mt="space.02">
        {subtitle ? (
          <Tooltip
            disabled={!hoverLabel}
            hideOnClick={false}
            label={hasCopied ? 'Copied!' : hoverLabel}
            labelProps={{ wordWrap: 'break-word' }}
            maxWidth="230px"
            placement="bottom"
          >
            <styled.button
              _hover={{ cursor: 'pointer' }}
              color={token('colors.accent.text-subdued')}
              display="flex"
              onClick={onCopy}
              type="button"
            >
              <styled.span color={token('colors.accent.text-subdued')} fontSize={1} mr="space.01">
                {subtitle}
              </styled.span>
              {hoverLabel ? <FiCopy size="14px" /> : null}
            </styled.button>
          </Tooltip>
        ) : null}
        {subValue ? (
          <styled.button onClick={subValueAction} gap="space.01" type="button">
            {/* // #4164 FIXME need to visual check this */}
            {/* // #4164 FIXME migrate color('accent') set to  token('colors.accent.text-primary') here */}
            <styled.span
              color={
                subValueAction
                  ? token('colors.accent.text-primary')
                  : token('colors.accent.text-subdued')
              }
              fontSize={1}
            >
              {subValue}
            </styled.span>
            {subValueAction ? <FiArrowUpRight color={token('colors.accent.text-primary')} /> : null}
          </styled.button>
        ) : null}
      </SpaceBetween>
    </Flag>
  );
}
