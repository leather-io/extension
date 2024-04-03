import { token } from 'leather-styles/tokens';

import { pxStringToNumber } from '@shared/utils/px-string-to-number';

import { useViewportMinWidth } from '@app/common/hooks/use-media-query';
import { useHasLedgerKeys } from '@app/store/ledger/ledger.selectors';
import { getHeightOffset } from '@app/ui/components/containers/dialog/dialog';

// virtuosoHeight = calc(InteractiveItem height - negative margin)
// calc(72px - 24px) = 58
const virtuosoHeight = 58;

type VirtuosoVariants = 'footer' | 'no-footer' | 'popup';

export function useGetVirtuosoHeight(accountNum: number, variant: VirtuosoVariants) {
  const isAtleastBreakpointMd = useViewportMinWidth('md');

  const isLedger = useHasLedgerKeys();
  const offset = getHeightOffset(true, !isLedger);

  // TODO rename dialogHeight as actionPopupHeight in monorepo
  const actionPopupHeight = token('sizes.dialogHeight');
  // handles resizing of a full size browser - non popup
  const isNarrowLargeWindow =
    window.innerHeight > pxStringToNumber(actionPopupHeight) && !isAtleastBreakpointMd;

  if (accountNum > 10) {
    if (variant === 'popup') return '50vh';
    if (isNarrowLargeWindow) {
      return variant === 'footer' ? '85vh' : '95vh';
    }
    return variant === 'footer' ? '70vh' : '85vh';
  }
  const visibleAccounts = virtuosoHeight * accountNum;
  return visibleAccounts + offset;
}
