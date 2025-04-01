import { createContext, useContext } from 'react';

export type Nonce = string | number;

interface NonceEditorContext {
  loadedNonce: Nonce;
  nonce: Nonce;
  onGoBack(): void;
  onSetLoadedNonce(value: Nonce): void;
  onSetNonce(value: Nonce): void;
  onUserActivatesNonceEditor(): void;
}

export const nonceEditorContext = createContext<NonceEditorContext | null>(null);

export function useNonceEditorContext() {
  const context = useContext(nonceEditorContext);
  if (!context)
    throw new Error('`useNonceEditorContext` must be used within a `NonceEditorProvider`');
  return context;
}
