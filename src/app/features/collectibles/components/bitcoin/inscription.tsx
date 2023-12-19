import { useLocation, useNavigate } from 'react-router-dom';

import { Inscription as InscriptionType } from '@shared/models/inscription.model';
import { RouteUrls } from '@shared/route-urls';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { convertInscriptionToSupportedInscriptionType } from '@app/query/bitcoin/ordinals/inscription.hooks';
import { OrdinalIcon } from '@app/ui/components/icons/ordinal-icon';

import { CollectibleAudio } from '../_collectible-types/collectible-audio';
import { CollectibleIframe } from '../_collectible-types/collectible-iframe';
import { CollectibleImage } from '../_collectible-types/collectible-image';
import { CollectibleOther } from '../_collectible-types/collectible-other';
import { InscriptionText } from './inscription-text';

interface InscriptionProps {
  rawInscription: InscriptionType;
}
export function Inscription({ rawInscription }: InscriptionProps) {
  const inscription = convertInscriptionToSupportedInscriptionType(rawInscription);
  const navigate = useNavigate();
  const location = useLocation();

  function openSendInscriptionModal() {
    navigate(RouteUrls.SendOrdinalInscription, {
      state: { inscription, backgroundLocation: location },
    });
  }

  switch (inscription.type) {
    case 'audio':
      return (
        <CollectibleAudio
          icon={<OrdinalIcon size="lg" />}
          key={inscription.title}
          onClickCallToAction={() => openInNewTab(inscription.infoUrl)}
          onClickSend={() => openSendInscriptionModal()}
          subtitle="Ordinal inscription"
          title={`# ${inscription.number}`}
        />
      );
    case 'html':
    case 'svg':
    case 'video':
      return (
        <CollectibleIframe
          icon={<OrdinalIcon size="lg" />}
          key={inscription.title}
          onClickCallToAction={() => openInNewTab(inscription.infoUrl)}
          onClickSend={() => openSendInscriptionModal()}
          src={inscription.src}
          subtitle="Ordinal inscription"
          title={`# ${inscription.number}`}
        />
      );
    case 'image':
      return (
        <CollectibleImage
          icon={<OrdinalIcon size="lg" />}
          key={inscription.title}
          onClickCallToAction={() => openInNewTab(inscription.infoUrl)}
          onClickSend={() => openSendInscriptionModal()}
          src={inscription.src}
          subtitle="Ordinal inscription"
          title={`# ${inscription.number}`}
        />
      );
    case 'text':
      return (
        <InscriptionText
          contentSrc={inscription.contentSrc}
          inscriptionNumber={inscription.number}
          onClickCallToAction={() => openInNewTab(inscription.infoUrl)}
          onClickSend={() => openSendInscriptionModal()}
        />
      );
    case 'other':
      return (
        <CollectibleOther
          key={inscription.title}
          onClickCallToAction={() => openInNewTab(inscription.infoUrl)}
          onClickSend={() => openSendInscriptionModal()}
          subtitle="Ordinal inscription"
          title={`# ${inscription.number}`}
        >
          <OrdinalIcon />
        </CollectibleOther>
      );
    default:
      return null;
  }
}
