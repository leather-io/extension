import { Flex, HStack, styled } from 'leather-styles/jsx';

import type { MarketData } from '@leather.io/models';
import { Approver, Avatar, Badge, Flag, GiftIcon, Pressable } from '@leather.io/ui';

import { CryptoAssetItemPlaceholder } from '@app/components/crypto-asset-item/crypto-asset-item-placeholder';
import type { Fee, FeeType } from '@app/features/fee-editor/fee-editor.context';

import { FeeRateItemLayout } from './fee-rate-item.layout';
import { FeeValueItemLayout } from './fee-value-item.layout';

interface SelectedFeeItemProps {
  feeType: FeeType;
  isLoading: boolean;
  isSponsored: boolean;
  marketData: MarketData;
  onEditFee(): void;
  selectedFee: Fee | null;
}
export function SelectedFeeItem({
  feeType,
  isLoading,
  isSponsored,
  marketData,
  onEditFee,
  selectedFee,
}: SelectedFeeItemProps) {
  if (isSponsored)
    return (
      <Approver.Section>
        <Flag img={<Avatar icon={<GiftIcon />} />} my="space.02">
          <HStack alignItems="center" justifyContent="space-between">
            <styled.span textStyle="label.02">Sponsored fee</styled.span>
            <Flex alignItems="center" gap="space.03">
              <Badge label="FREE" variant="success" />
            </Flex>
          </HStack>
        </Flag>
      </Approver.Section>
    );

  if (isLoading || !selectedFee)
    return (
      <Approver.Section>
        <CryptoAssetItemPlaceholder />
      </Approver.Section>
    );

  return (
    <Approver.Section>
      <Pressable onClick={onEditFee} my="space.02">
        {feeType === 'fee-rate' ? (
          <FeeRateItemLayout fee={selectedFee} marketData={marketData} showChevron />
        ) : null}
        {feeType === 'fee-value' ? (
          <FeeValueItemLayout fee={selectedFee} marketData={marketData} showChevron />
        ) : null}
      </Pressable>
    </Approver.Section>
  );
}
