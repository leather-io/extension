import { useState } from 'react';

export function useRegisterChildren<T extends string>() {
  const [children, setChildren] = useState<Record<T, number>>({} as Record<T, number>);

  function registerChild(child: T) {
    setChildren(children => ({ ...children, [child]: (children[child] || 0) + 1 }));
  }

  function deregisterChild(child: T) {
    setChildren(children => ({ ...children, [child]: (children[child] || 0) - 1 }));
  }

  function hasChild(child: T) {
    return children[child] > 0;
  }

  return { children: Object.keys(children) as T[], registerChild, deregisterChild, hasChild };
}
