import { Metadata as StacksNftMetadata } from '@hirosystems/token-metadata-api-client';
import * as IPFS from 'ipfs-core';
import { create } from 'ipfs-http-client';
import { concat } from 'uint8arrays';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';

import { StxAvatarIcon } from '@leather.io/ui';

import { isValidUrl } from '@shared/utils/validate-url';

import { CollectibleImage } from '../../../../components/collectibles/collectible-image';
import { ImageUnavailable } from '../../../../components/collectibles/image-unavailable';

interface StacksNonFungibleTokensProps {
  metadata: StacksNftMetadata;
  nft: unknown;
}
// Create an IPFS client instance
// const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0/9034258c5b184c0f9dc1eba492fda2de' });

const ipfs = create({
  host: 'http://127.0.0.1',
  port: 8081,
  protocol: 'http',
  //  headers: {
  //    authorization: auth,
  //  },
});

async function fetchJson(cid: string) {
  try {
    // Fetch the JSON file from IPFS
    const stream = ipfs.cat(cid);
    let data = '';

    // Concatenate the data chunks
    for await (const chunk of stream) {
      data += chunk.toString();
    }

    // Parse the JSON data
    const jsonData = JSON.parse(data);
    console.log('JSON Data:', jsonData);
  } catch (error) {
    console.error('Error fetching JSON from IPFS:', error);
  }
}

export function StacksNonFungibleTokens({ metadata, nft }: StacksNonFungibleTokensProps) {
  const isImageAvailable = metadata.cached_image && isValidUrl(metadata.cached_image);

  // console.log('collectible StacksNonFungibleTokens', metadata);
  // fetchJson(metadata.cached_image);
  // const data = await fetchJson('QmaDQPK8ckuRQKhkKVyXgxELvbEge81WiwhKvmYVCM8mgM');
  // Replace '<CID>' with the actual IPFS hash of your JSON file
  // console.log('IPFS', data);
  // for await (const chunk of ipfs.cat(CID)) {
  //   chunks.push(chunk);
  // }

  // const data = concat(chunks);
  // const decodedData = JSON.parse(new TextDecoder().decode(data).toString());

  // console.log('collectible StacksNonFungibleTokens', decodedData);
  console.log('collectible StacksNonFungibleTokens', nft);

  if (!isImageAvailable) return <ImageUnavailable />;
  return (
    <CollectibleImage
      alt="stacks nft"
      icon={<StxAvatarIcon size="lg" />}
      src={metadata.cached_image ?? ''}
      subtitle="Stacks NFT"
      title={metadata.name ?? ''}
    />
  );
}
