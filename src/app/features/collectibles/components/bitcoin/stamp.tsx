import { Stamp as BitcoinStamp } from '@leather.io/query';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { StampsAvatarIcon } from '@app/ui/components/avatar/stamps-avatar-icon';

import { CollectibleImage } from '../../../../components/collectibles/collectible-image';

const stampChainAssetUrl = 'https://stampchain.io/asset.html?stampNumber=';

export function Stamp(props: { bitcoinStamp: BitcoinStamp }) {
  const { bitcoinStamp } = props;

  return (
    <CollectibleImage
      icon={<StampsAvatarIcon size="lg" />}
      key={bitcoinStamp.stamp}
      onClickCallToAction={() => openInNewTab(`${stampChainAssetUrl}${bitcoinStamp.stamp}`)}
      src={bitcoinStamp.stamp_url}
      subtitle="Bitcoin Stamp"
      title={`# ${bitcoinStamp.stamp}`}
    />
  );
}
