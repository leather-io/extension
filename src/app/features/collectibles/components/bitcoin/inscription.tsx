import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { OrdinalIconFull } from '@app/components/icons/ordinal-icon-full';
import { useInscription } from '@app/query/bitcoin/ordinals/inscription.hooks';
import { TaprootUtxo } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';

import { CollectibleImage } from '../_collectible-types/collectible-image';
import { CollectibleOther } from '../_collectible-types/collectible-other';
import { InscriptionText } from './inscription-text';

interface InscriptionProps {
  path: string;
  utxo: TaprootUtxo;
}
export function Inscription({ path, utxo }: InscriptionProps) {
  const { isLoading, isError, data: inscription } = useInscription(path);
  const navigate = useNavigate();

  if (isLoading) return null;
  if (isError) return null;

  function openSendInscriptionModal() {
    navigate(RouteUrls.SendOrdinalInscription, {
      state: { inscription, utxo },
    });
  }

  switch (inscription.type) {
    case 'image': {
      return (
        <CollectibleImage
          key={inscription.title}
          onClickCallToAction={() => openInNewTab(inscription.infoUrl)}
          onClickSend={() => openSendInscriptionModal()}
          src={inscription.src}
          subtitle="Ordinal inscription"
          title={`# ${inscription.inscription_number}`}
        />
      );
    }
    case 'text': {
      return (
        <InscriptionText
          contentSrc={inscription.contentSrc}
          inscriptionNumber={inscription.inscription_number}
          onClickCallToAction={() => openInNewTab(inscription.infoUrl)}
          onClickSend={() => openSendInscriptionModal()}
        />
      );
    }
    case 'other': {
      return (
        <CollectibleOther
          key={inscription.title}
          onClickCallToAction={() => openInNewTab(inscription.infoUrl)}
          onClickSend={() => openSendInscriptionModal()}
          subtitle="Ordinal inscription"
          title={`# ${inscription.inscription_number}`}
        >
          <OrdinalIconFull />
        </CollectibleOther>
      );
    }
    default: {
      return null;
    }
  }
}
