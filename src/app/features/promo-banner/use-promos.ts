import { useMemo } from 'react';

import { useAppDispatch } from '@app/store';
import { settingsActions } from '@app/store/settings/settings.actions';
import { useDismissedPromoIndexes } from '@app/store/settings/settings.selectors';

export function usePromos() {
  const dispatch = useAppDispatch();
  const dismissedPromoIndexes = useDismissedPromoIndexes();
  return useMemo(
    () => ({
      dismissedPromoIndexes,
      dismissPromo(promoIndex: number) {
        dispatch(settingsActions.promoDismissed(promoIndex));
      },
    }),
    [dismissedPromoIndexes, dispatch]
  );
}
