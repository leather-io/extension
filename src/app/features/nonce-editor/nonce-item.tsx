import { Flex, HStack, styled } from 'leather-styles/jsx';

import {
  Approver,
  Avatar,
  ChevronRightIcon,
  Flag,
  NumberedListIcon,
  Pressable,
} from '@leather.io/ui';

import type { Nonce } from './nonce-editor.context';

interface SelectedFeeItemProps {
  nonce: Nonce;
  onEditNonce(): void;
}
export function NonceItem({ nonce, onEditNonce }: SelectedFeeItemProps) {
  return (
    <Approver.Section>
      <Pressable onClick={onEditNonce} my="space.02">
        <Flag img={<Avatar icon={<NumberedListIcon />} />}>
          <HStack alignItems="center" justifyContent="space-between">
            <styled.span textStyle="label.02">Nonce</styled.span>
            <Flex alignItems="center" gap="space.03">
              <styled.span textStyle="label.02">{nonce ?? '–'}</styled.span>
              <ChevronRightIcon variant="small" />
            </Flex>
          </HStack>
        </Flag>
      </Pressable>
    </Approver.Section>
  );
}
