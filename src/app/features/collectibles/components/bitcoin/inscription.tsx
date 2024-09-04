import { useLocation, useNavigate } from 'react-router-dom';

import { ORD_IO_URL } from '@leather.io/constants';
import { type Inscription } from '@leather.io/models';
import { OrdinalAvatarIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';

import { CollectibleAudio } from '../_collectible-types/collectible-audio';
import { CollectibleIframe } from '../_collectible-types/collectible-iframe';
import { CollectibleImage } from '../_collectible-types/collectible-image';
import { CollectibleOther } from '../_collectible-types/collectible-other';
import { InscriptionText } from './inscription-text';

interface InscriptionProps {
  inscription: Inscription;
}

function openInscriptionUrl(num: number) {
  return openInNewTab(`${ORD_IO_URL}/${num}`);
}

export function Inscription({ inscription }: InscriptionProps) {
  const navigate = useNavigate();
  const location = useLocation();

  function openSendInscriptionModal() {
    navigate(RouteUrls.SendOrdinalInscription, {
      state: { inscription, backgroundLocation: location },
    });
  }

  switch (inscription.mimeType) {
    case 'audio':
      return (
        <CollectibleAudio
          icon={<OrdinalAvatarIcon size="lg" />}
          key={inscription.title}
          onClickCallToAction={() => openInscriptionUrl(inscription.number)}
          onClickSend={() => openSendInscriptionModal()}
          subtitle="Ordinal inscription"
          title={`# ${inscription.number}`}
        />
      );
    case 'html':
    case 'svg':
    case 'video':
    case 'gltf':
      return (
        <CollectibleIframe
          icon={<OrdinalAvatarIcon size="lg" />}
          key={inscription.title}
          onClickCallToAction={() => openInscriptionUrl(inscription.number)}
          onClickSend={() => openSendInscriptionModal()}
          src={inscription.src}
          subtitle="Ordinal inscription"
          title={`# ${inscription.number}`}
        />
      );
    case 'image':
      return (
        <CollectibleImage
          icon={<OrdinalAvatarIcon size="lg" />}
          key={inscription.title}
          onClickCallToAction={() => openInscriptionUrl(inscription.number)}
          onClickSend={() => openSendInscriptionModal()}
          src={inscription.src}
          subtitle="Ordinal inscription"
          title={`# ${inscription.number}`}
        />
      );
    case 'text':
      return (
        <InscriptionText
          contentSrc={inscription.src}
          inscriptionNumber={inscription.number}
          onClickCallToAction={() => openInscriptionUrl(inscription.number)}
          onClickSend={() => openSendInscriptionModal()}
        />
      );
    case 'other':
      return (
        <CollectibleOther
          key={inscription.title}
          onClickCallToAction={() => openInscriptionUrl(inscription.number)}
          onClickSend={() => openSendInscriptionModal()}
          subtitle="Ordinal inscription"
          title={`# ${inscription.number}`}
        >
          <OrdinalAvatarIcon size="lg" />
        </CollectibleOther>
      );
    default:
      return null;
  }
}
