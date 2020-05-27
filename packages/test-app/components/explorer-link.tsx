import React from 'react';
import { Link } from '@blockstack/connect';

interface LinkProps {
  txId: string;
}

export const ExplorerLink: React.FC<LinkProps> = ({ txId }) => {
  const url = `https://testnet-explorer.blockstack.org/txid/${txId.replace('"', '')}`;
  return (
    <Link onClick={() => window.open(url, '_blank')} color="blue" display="block">
      View transaction in explorer
    </Link>
  );
};
