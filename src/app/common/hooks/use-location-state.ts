import { useLocation } from 'react-router-dom';
import get from 'lodash.get';
import { useEffect, useState } from 'react';
import { isUndefined } from '@shared/utils';

export function useLocationState(propName: string): string | undefined;
export function useLocationState(propName: string, defaultValue: string): string;
export function useLocationState(propName: string, defaultValue?: string) {
  const location = useLocation();
  return get(location, `state.${propName}`, defaultValue);
}

export function useLocationStateWithCache(propName: string): string | undefined;
export function useLocationStateWithCache(propName: string, defaultValue: string): string;
export function useLocationStateWithCache(propName: string, defaultValue?: string) {
  const location = useLocation();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const stateVal = get(location, `state.${propName}`);
    if (!isUndefined(stateVal)) setValue(stateVal);
  });

  return value ?? defaultValue;
}
