import { HStack, styled } from 'leather-styles/jsx';

import { AddressDisplayer, Approver, BtcAvatarIcon, ItemLayout, UserIcon } from '@leather.io/ui';
import { formatDustUsdAmounts, formatMoneyPadded, i18nFormatCurrency } from '@leather.io/utils';

import type { TransferRecipient } from '@shared/models/form.model';

import { useConvertCryptoCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { IconWrapper } from '@app/components/icon-wrapper';
import { Divider } from '@app/components/layout/divider';

interface ApproveTransactionRecipientsProps {
  recipients: TransferRecipient[];
}

export function ApproveTransactionRecipients({ recipients }: ApproveTransactionRecipientsProps) {
  const convertToFiatAmount = useConvertCryptoCurrencyToFiatAmount('BTC');

  return recipients.map(({ address, amount }) => {
    const fiatAmount = convertToFiatAmount(amount);

    const titleRight = formatMoneyPadded(amount);
    const captionRight = formatDustUsdAmounts(i18nFormatCurrency(fiatAmount));

    return (
      <Approver.Section key={address}>
        <Approver.Subheader>
          <styled.span textStyle="label.01">You'll send</styled.span>
        </Approver.Subheader>

        <ItemLayout
          img={<BtcAvatarIcon />}
          titleLeft="Bitcoin"
          captionLeft="Bitcoin blockchain"
          titleRight={titleRight}
          captionRight={captionRight}
        />

        <Divider mt="space.05" mb="space.04" />

        <Approver.Subheader>
          <styled.span textStyle="label.01">To address</styled.span>
        </Approver.Subheader>
        <HStack key={address} alignItems="center" gap="space.04" pb="space.03">
          <IconWrapper>
            <UserIcon />
          </IconWrapper>
          <AddressDisplayer address={address} />
        </HStack>
      </Approver.Section>
    );
  });
}
