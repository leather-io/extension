import { useState } from 'react';

import type { HasChildren } from '@app/common/has-children';

import { type Nonce, nonceEditorContext as NonceEditorContext } from './nonce-editor.context';

interface NonceEditorProviderProps extends HasChildren {
  nonce: Nonce;
  onGoBack(): void;
}
export function NonceEditorProvider({
  children,
  nonce: currentNonce,
  onGoBack,
}: NonceEditorProviderProps) {
  const [loadedNonce, setLoadedNonce] = useState<Nonce>(currentNonce);
  const [nonce, setNonce] = useState<Nonce>(currentNonce);

  return (
    <NonceEditorContext.Provider
      value={{
        loadedNonce,
        nonce,
        onGoBack,
        onSetLoadedNonce: (value: Nonce) => setLoadedNonce(value),
        onSetNonce: (value: Nonce) => setNonce(value),
      }}
    >
      {children}
    </NonceEditorContext.Provider>
  );
}
