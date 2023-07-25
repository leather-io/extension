import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

import { isUndefined } from '@shared/utils';

export function useLocationState(propName: string): string | undefined;
export function useLocationState(propName: string, defaultValue: string): string;
export function useLocationState(propName: 'accountIndex'): number;
export function useLocationState(propName: 'backgroundLocation'): Location;
export function useLocationState(propName: string, defaultValue?: string) {
  const location = useLocation();
  return get(location, `state.${propName}`, defaultValue);
}

export function useLocationStateWithCache<T = string>(propName: string): T | undefined;
export function useLocationStateWithCache<T = string>(propName: string, defaultValue: T): T;
export function useLocationStateWithCache<T = string>(propName: string, defaultValue?: T) {
  const location = useLocation();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const stateVal = get(location, `state.${propName}`);
    if (!isUndefined(stateVal)) setValue(stateVal);
  }, [location, propName]);

  return value ?? defaultValue;
}
