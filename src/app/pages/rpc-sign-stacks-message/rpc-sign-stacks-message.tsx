import { StacksMessageSigner } from '@app/features/stacks-message-signer/stacks-message-signer';

interface RpcSignStacksMessageProps {}

export function RpcSignStacksMessage(props: RpcSignStacksMessageProps) {
  return <StacksMessageSigner />;
}
