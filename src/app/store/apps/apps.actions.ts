import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { appsSlice, selectAllowedDomains } from './apps.slice';

const appActions = appsSlice.actions;

export function useUserGrantsPermissionToAppDomain() {
  const dispatch = useDispatch();
  return useCallback(
    (domain: string) => {
      const host = new URL(domain).host;
      dispatch(appActions.appConnected({ domain: host }));
    },
    [dispatch]
  );
}

export function useIsDomainPreApproved() {
  const domains = useSelector(selectAllowedDomains);
  return useCallback(
    (domain: string) => {
      const url = new URL(domain);
      return domains.flatMap(Object.values).includes(url.host);
    },
    [domains]
  );
}
