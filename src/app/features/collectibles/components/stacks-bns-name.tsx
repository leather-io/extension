import StacksNftBns from '@assets/images/stacks-nft-bns.png';

import { CollectibleLayout } from './collectible.layout';

const backgroundProps = {
  backgroundColor: '#DCDDE2',
  border: 'transparent',
  borderRadius: '16px',
};

export function StacksBnsName(props: { bnsName: string }) {
  const { bnsName } = props;

  return (
    <CollectibleLayout
      backgroundElementProps={backgroundProps}
      // TODO: Add later when makes sense with other collectibles
      // hoverText="Bitcoin Naming System"
      subtitle="BNS name"
      title={bnsName}
    >
      <img alt="nft image" src={StacksNftBns} width="100px" />
    </CollectibleLayout>
  );
}
