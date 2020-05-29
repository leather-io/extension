import React from 'react';
import { Link } from '@blockstack/connect';

interface LinkProps {
  txId: string;
  text?: string;
}

export const ExplorerLink: React.FC<LinkProps> = ({ txId, text }) => {
  const url = `https://testnet-explorer.blockstack.org/txid/${txId.replace('"', '')}`;
  return (
    <Link onClick={() => window.open(url, '_blank')} color="blue" display="block">
      {text || 'View transaction in explorer'}
    </Link>
  );
};
