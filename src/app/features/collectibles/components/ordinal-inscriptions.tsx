import { DefinedQueryObserverResult, useQueries } from '@tanstack/react-query';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { createQueryOptions as createQueryOptionsInscriptionInfo } from '@app/query/bitcoin/ordinals/use-inscription-by-txid.query';
import { createQueryOptions as createQueryOptionsInscriptionMetadata } from '@app/query/bitcoin/ordinals/use-inscription.query';
import { useTaprootAddressUtxosQuery } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';
import {
  OrdApiXyzGetInscriptionByInscriptionSchema,
  OrdApiXyzGetTransactionOutput,
  createInfoUrl,
  whenOrdinalType,
} from '@app/query/bitcoin/ordinals/utils';

import { CollectibleImage } from './collectible-image';
import { CollectibleOther } from './collectible-other';
import { CollectibleText } from './collectible-text';

interface InscriptionProps {
  data: OrdApiXyzGetInscriptionByInscriptionSchema;
}

function Inscription({ data }: InscriptionProps) {
  const inscription = whenOrdinalType(data['content type'], {
    image: () => ({
      infoUrl: createInfoUrl(data.content),
      src: `https://ordinals.com${data.content}`,
      title: data.title,
      type: 'image',
    }),
    text: () => ({
      contentSrc: `https://ordinals.com${data.content}`,
      infoUrl: createInfoUrl(data.content),
      title: data.title,
      type: 'text',
    }),
    other: () => ({
      infoUrl: createInfoUrl(data.content),
      title: data.title,
      type: 'other',
    }),
  });

  switch (inscription.type) {
    case 'image': {
      return (
        <CollectibleImage
          key={inscription.title}
          onSelectCollectible={() => openInNewTab(inscription.infoUrl)}
          src={inscription.src}
          subtitle="Ordinal inscription"
          title={inscription.title}
        />
      );
    }
    case 'text': {
      return (
        <CollectibleText
          key={inscription.title}
          onSelectCollectible={() => openInNewTab(inscription.infoUrl)}
          contentSrc={inscription.contentSrc}
          subtitle="Ordinal inscription"
          title={inscription.title}
        />
      );
    }
    case 'other': {
      return (
        <CollectibleOther
          key={inscription.title}
          onSelectCollectible={() => openInNewTab(inscription.infoUrl)}
          subtitle="Ordinal inscription"
          title={inscription.title}
        />
      );
    }
    default: {
      return null;
    }
  }
}

export function OrdinalInscriptions() {
  const { data: utxos = [] } = useTaprootAddressUtxosQuery();

  // use each utxo to get inscription details
  const inscriptionInfoQueries = useQueries({
    queries: utxos.map(utxo => createQueryOptionsInscriptionInfo(utxo.txid)),
  });

  // use inscription details to get inscription metadata
  const inscriptionMetadataQueries = useQueries({
    queries: inscriptionInfoQueries
      .filter((q): q is DefinedQueryObserverResult<OrdApiXyzGetTransactionOutput> =>
        Boolean(q.data)
      )
      .map(q => createQueryOptionsInscriptionMetadata(q.data.inscriptions)),
  });

  // use metadata to sort by descending inscription id
  const sorted = inscriptionMetadataQueries
    .filter((q): q is DefinedQueryObserverResult<OrdApiXyzGetInscriptionByInscriptionSchema> =>
      Boolean(q.data)
    )
    .sort((q1, q2) => q2.data.inscription_number - q1.data.inscription_number);

  return (
    <>
      {sorted.map(q => (
        <Inscription data={q.data} />
      ))}
    </>
  );
}
