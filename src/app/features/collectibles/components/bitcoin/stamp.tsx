import { Stamp as BitcoinStamp } from '@leather-wallet/query';
import { StampsAvatarIcon } from '@leather-wallet/ui';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';

import { CollectibleImage } from '../_collectible-types/collectible-image';

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
