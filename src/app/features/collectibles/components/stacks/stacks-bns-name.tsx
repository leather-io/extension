import StacksNftBns from '@assets/images/stacks-nft-bns.png';

import { StxAvatarIcon } from '@leather.io/ui';

import { CollectibleItemLayout } from '../../../../components/collectibles/collectible-item.layout';

export function StacksBnsName(props: { bnsName: string }) {
  const { bnsName } = props;

  return (
    <CollectibleItemLayout
      collectibleTypeIcon={<StxAvatarIcon size="lg" />}
      subtitle="Bitcoin Naming System"
      title={bnsName}
    >
      <img alt="nft image" src={StacksNftBns} width="100px" />
    </CollectibleItemLayout>
  );
}
