interface NftMetadataAttribute {
  trait_type: string;
  display_type: string;
  value: string;
}

interface NftMetadataProperty {
  type: string;
  description: string;
}

export interface StacksNftMetadata {
  sip: number;
  name: string;
  description: string;
  image: string;
  cached_image: string;
  attributes: NftMetadataAttribute[];
  properties: { [key: string]: NftMetadataProperty };
}

export interface StacksNftMetadataResponse {
  token_uri: string;
  metadata: StacksNftMetadata;
}
