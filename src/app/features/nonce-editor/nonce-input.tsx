import { Input } from '@leather.io/ui';

import type { Nonce } from './nonce-editor.context';

interface NonceInputProps {
  nonce: Nonce;
  onSetNonce(value: string): void;
}
export function NonceInput({ nonce, onSetNonce }: NonceInputProps) {
  return (
    <Input.Root style={{ minHeight: '40px' }}>
      <Input.Field
        onChange={e => onSetNonce(e.target.value)}
        placeholder="Nonce"
        value={nonce.toString() ?? ''}
      />
    </Input.Root>
  );
}
