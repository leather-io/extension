import { useMemo } from 'react';

import { useAppDispatch } from '@app/store';
import { settingsActions } from '@app/store/settings/settings.actions';
import { useDismissedPromoIndexes, usePromoIndexes } from '@app/store/settings/settings.selectors';

export function usePromos() {
  const dispatch = useAppDispatch();
  const promoIndexes = usePromoIndexes();
  const dismissedPromoIndexes = useDismissedPromoIndexes();
  return useMemo(
    () => ({
      promoIndexes,
      dismissedPromoIndexes,
      initializePromos(total: number) {
        dispatch(settingsActions.initializePromos(total));
      },
      dismissPromo(promoIndex: number) {
        dispatch(settingsActions.promoDismissed(promoIndex));
      },
    }),
    [dismissedPromoIndexes, dispatch, promoIndexes]
  );
}
