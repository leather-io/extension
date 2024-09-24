import StacksNftBns from '@assets/images/stacks-nft-bns.png';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { CollectibleItemLayout, StxAvatarIcon } from '@leather.io/ui';

export function StacksBnsName(props: { bnsName: string }) {
  const { bnsName } = props;

  return (
    <CollectibleItemLayout
      collectibleTypeIcon={<StxAvatarIcon size="lg" />}
      subtitle="Bitcoin Naming System"
      title={bnsName}
      testId={SendCryptoAssetSelectors.InscriptionSendButton}
    >
      <img alt="nft image" src={StacksNftBns} width="100px" />
    </CollectibleItemLayout>
  );
}
