import { useState } from 'react';

export function useRegisterChildren<T extends string>() {
  const [childCount, setChildCount] = useState<Record<T, number>>({} as Record<T, number>);

  function registerChild(child: T) {
    setChildCount(children => ({ ...children, [child]: (children[child] || 0) + 1 }));
  }

  function deregisterChild(child: T) {
    setChildCount(children => ({ ...children, [child]: (children[child] || 0) - 1 }));
  }

  function hasChild(child: T) {
    return childCount[child] > 0;
  }

  return {
    childCount,
    children: Object.keys(childCount) as T[],
    registerChild,
    deregisterChild,
    hasChild,
  };
}

export type ChildRegister<T extends string> = ReturnType<typeof useRegisterChildren<T>>;
