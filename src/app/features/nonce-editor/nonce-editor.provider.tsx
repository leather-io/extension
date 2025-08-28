import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { RouteUrls } from '@shared/route-urls';

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
  const [hasUserSetManualNonce, setHasUserSetManualNonce] = useState(false);

  const [loadedNonce, setLoadedNonce] = useState<Nonce>(currentNonce);
  const [nonce, setNonce] = useState<Nonce>(currentNonce);

  useEffect(() => {
    if (hasUserSetManualNonce) return;
    setLoadedNonce(currentNonce);
    setNonce(currentNonce);
  }, [currentNonce, hasUserSetManualNonce]);

  const navigate = useNavigate();

  return (
    <NonceEditorContext.Provider
      value={{
        loadedNonce,
        nonce,
        onGoBack,
        onSetLoadedNonce: (value: Nonce) => setLoadedNonce(value),
        onSetNonce: (value: Nonce) => {
          setNonce(value);
          setHasUserSetManualNonce(true);
        },
        onUserActivatesNonceEditor: () => navigate(RouteUrls.NonceEditor),
      }}
    >
      {children}
    </NonceEditorContext.Provider>
  );
}
