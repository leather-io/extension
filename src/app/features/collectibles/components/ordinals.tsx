import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useInscriptionQuery } from '@app/query/bitcoin/ordinals/use-inscription.query';
import { useOrdinalsAwareUtxoQuery } from '@app/query/bitcoin/ordinals/use-ordinals-aware-utxo.query';
import {
  TaprootUtxo,
  useTaprootAccountUtxosQuery,
} from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';
import {
  InscriptionInfo,
  createInfoUrl,
  whenInscriptionType,
} from '@app/query/bitcoin/ordinals/utils';

import { CollectibleImage } from './collectible-image';
import { CollectibleOther } from './collectible-other';
import { CollectibleText } from './collectible-text';

interface InscriptionProps {
  path: string;
  utxo: TaprootUtxo;
}

function Inscription({ path, utxo }: InscriptionProps) {
  const { isLoading, isError, data: inscription } = useInscriptionQuery(path);
  const navigate = useNavigate();

  if (isLoading) return null;
  if (isError) return null;

  const inscriptionMetadata = whenInscriptionType<InscriptionInfo>(inscription.content_type, {
    image: () => ({
      infoUrl: createInfoUrl(inscription.content),
      src: `https://ordapi.xyz${inscription.content}`,
      type: 'image',
      ...inscription,
    }),
    text: () => ({
      contentSrc: `https://ordapi.xyz${inscription.content}`,
      infoUrl: createInfoUrl(inscription.content),
      type: 'text',
      ...inscription,
    }),
    other: () => ({
      infoUrl: createInfoUrl(inscription.content),
      type: 'other',
      ...inscription,
    }),
  });

  function openSendInscriptionModal() {
    navigate(RouteUrls.SendOrdinalInscription, {
      state: { inscription: inscriptionMetadata, utxo },
    });
  }

  switch (inscriptionMetadata.type) {
    case 'image': {
      return (
        <CollectibleImage
          key={inscriptionMetadata.title}
          onClickCallToAction={() => openInNewTab(inscriptionMetadata.infoUrl)}
          onClickSend={() => openSendInscriptionModal()}
          src={inscriptionMetadata.src}
          subtitle="Ordinal inscription"
          title={`# ${inscription.inscription_number}`}
        />
      );
    }
    case 'text': {
      return (
        <CollectibleText
          key={inscriptionMetadata.title}
          onClickCallToAction={() => openInNewTab(inscriptionMetadata.infoUrl)}
          onClickSend={() => openSendInscriptionModal()}
          contentSrc={inscriptionMetadata.contentSrc}
          subtitle="Ordinal inscription"
          title={`# ${inscription.inscription_number}`}
        />
      );
    }
    case 'other': {
      return (
        <CollectibleOther
          key={inscriptionMetadata.title}
          onClickCallToAction={() => openInNewTab(inscriptionMetadata.infoUrl)}
          onClickSend={() => openSendInscriptionModal()}
          subtitle="Ordinal inscription"
          title={`# ${inscription.inscription_number}`}
        />
      );
    }
    default: {
      return null;
    }
  }
}

interface InscriptionLoaderProps {
  utxo: TaprootUtxo;
  children(path: string): JSX.Element;
}
function InscriptionLoader({ utxo, children }: InscriptionLoaderProps) {
  const { data: inscriptionDetails } = useOrdinalsAwareUtxoQuery(utxo);
  if (!inscriptionDetails || !inscriptionDetails.inscriptions) return null;
  return children(inscriptionDetails.inscriptions);
}

export function Ordinals() {
  const { data: utxos = [] } = useTaprootAccountUtxosQuery();

  return (
    <>
      {utxos.map(utxo => (
        <InscriptionLoader key={utxo.txid} utxo={utxo}>
          {path => <Inscription path={path} utxo={utxo} />}
        </InscriptionLoader>
      ))}
    </>
  );
}
