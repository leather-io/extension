import { ReactNode } from 'react';

import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';
import { HStack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { Flag } from '@app/components/layout/flag';
import { LeatherButton } from '@app/ui/components/button';
import { ArrowUpIcon } from '@app/ui/components/icons/arrow-up-icon';
import { BtcIcon } from '@app/ui/components/icons/btc-icon';
import { CopyIcon } from '@app/ui/components/icons/copy-icon';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface BitcoinContractLockAmountProps {
  hoverLabel?: string;
  image?: ReactNode;
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
    <Flag align="middle" img={image || <BtcIcon />} width="100%">
      <HStack alignItems="center" justifyContent="space-between">
        <styled.span textStyle="label.01">{title ? title : 'BTC'}</styled.span>
        <styled.span
          data-testid={BitcoinContractRequestSelectors.BitcoinContractLockAmount}
          textStyle="label.01"
        >
          {value}
        </styled.span>
      </HStack>
      <HStack alignItems="center" justifyContent="space-between" mt="space.02">
        {subtitle ? (
          <BasicTooltip
            disabled={!hoverLabel}
            label={hasCopied ? 'Copied!' : hoverLabel}
            side="bottom"
          >
            <styled.button
              _hover={{ cursor: 'pointer' }}
              color="accent.text-subdued"
              display="flex"
              onClick={onCopy}
              type="button"
            >
              <styled.span color="accent.text-subdued" mr="space.01" textStyle="caption.01">
                {subtitle}
              </styled.span>
              {hoverLabel ? <CopyIcon size="14px" /> : null}
            </styled.button>
          </BasicTooltip>
        ) : null}
        {subValue ? (
          <LeatherButton onClick={subValueAction} variant="text">
            <HStack gap="space.01">
              <styled.span color={subValueAction ? 'stacks' : 'accent.text-subdued'}>
                {subValue}
              </styled.span>
              {subValueAction ? (
                <ArrowUpIcon color={token('colors.stacks')} transform="rotate(45deg)" />
              ) : null}
            </HStack>
          </LeatherButton>
        ) : null}
      </HStack>
    </Flag>
  );
}
