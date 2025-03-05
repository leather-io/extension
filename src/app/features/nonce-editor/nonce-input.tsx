import { Input } from '@leather.io/ui';

export function NonceInput() {
  return (
    <Input.Root style={{ minHeight: '40px' }}>
      <Input.Field onChange={e => onSetNonce(e.target.value)} placeholder="0" value={nonce ?? ''} />
    </Input.Root>
  );
}
