import { token } from 'leather-styles/tokens';

import { pxStringToNumber } from '@shared/utils/px-string-to-number';

import { useViewportMinWidth } from '@app/common/hooks/use-media-query';
import { useHasLedgerKeys } from '@app/store/ledger/ledger.selectors';
import { getHeightOffset } from '@app/ui/components/containers/dialog/dialog';

// virtuosoHeight = calc(InteractiveItem height - negative margin)
// calc(72px - 24px) = 58
const virtuosoHeight = 96;

type VirtuosoVariants = 'footer' | 'no-footer' | 'popup';
interface VirtuosoStyles {
  height: string | number;
  marginBottom?: string;
}

function vhToPixels(vh: string) {
  const numericHeight = +vh.replace('vh', '');
  return (numericHeight * window.innerHeight) / 100;
}

export function useGetVirtuosoHeight(
  accountNum: number,
  variant: VirtuosoVariants
): VirtuosoStyles {
  const isAtleastBreakpointMd = useViewportMinWidth('md');
  const isLedger = useHasLedgerKeys();
  const offset = getHeightOffset(true, !isLedger);

  // TODO rename dialogHeight as actionPopupHeight in monorepo
  const actionPopupHeight = token('sizes.dialogHeight');
  // handles resizing of a full size browser - non popup
  const isNarrowLargeWindow =
    window.innerHeight > pxStringToNumber(actionPopupHeight) && !isAtleastBreakpointMd;
  console.log(isNarrowLargeWindow, window.innerHeight);
  console.log('pete', vhToPixels('30vh') + 96);
  if (accountNum > 10) {
    if (variant === 'popup') return { height: '50vh' };
    if (isNarrowLargeWindow) {
      return variant === 'footer' ? { height: '85vh' } : { height: '90vh' }; // this was 95 but a bit tight
    }
    return variant === 'footer' ? { height: '70vh', marginBottom: '96px' } : { height: '80vh' };
    // : { height: vhToPixels('80vh') + pxStringToNumber(token('spacing.space.04')) }; //adding this magic seems to work well and the 16 relates to the marginBottom

    // still buggy when manually changing the brower height
  }
  const visibleAccounts = virtuosoHeight * accountNum;
  return { height: visibleAccounts + offset };
}

// .. this is still fucked! is it even worse than before?

// pretty bad when browser height gets resixex.

// maybe increase accountnum to 15 to check that???
