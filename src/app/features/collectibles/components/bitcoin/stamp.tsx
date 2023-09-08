import BitcoinStampImg from '@assets/images/bitcoin-stamp.png';
import { Box } from 'leather-styles/jsx';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Stamp as BitcoinStamp } from '@app/query/bitcoin/stamps/stamps-by-address.query';

import { CollectibleImage } from '../_collectible-types/collectible-image';

const stampChainAssetUrl = 'https://stampchain.io/asset.html?stampNumber=';

export function Stamp(props: { bitcoinStamp: BitcoinStamp }) {
  const { bitcoinStamp } = props;

  return (
    <CollectibleImage
      icon={
        <Box>
          <img src={BitcoinStampImg} width="30px" />
        </Box>
      }
      key={bitcoinStamp.stamp}
      onClickCallToAction={() => openInNewTab(`${stampChainAssetUrl}${bitcoinStamp.stamp}`)}
      src={bitcoinStamp.stamp_url}
      subtitle="Bitcoin Stamp"
      title={`# ${bitcoinStamp.stamp}`}
    />
  );
}
