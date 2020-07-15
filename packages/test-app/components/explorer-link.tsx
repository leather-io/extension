import React from 'react';
import { Link } from '@blockstack/connect';

interface LinkProps {
  txId: string;
  text?: string;
  skipConfirmCheck?: boolean;
  testSelector?: string;
}

export const ExplorerLink: React.FC<LinkProps> = ({ txId, text, testSelector }) => {
  const url = `https://testnet-explorer.blockstack.org/txid/${txId.replace('"', '')}`;
  return (
    <Link
      onClick={() => window.open(url, '_blank')}
      color="blue"
      display="block"
      my={3}
      data-test={testSelector}
      data-txid={txId}
    >
      {text || 'View transaction in explorer'}
    </Link>
  );
};
