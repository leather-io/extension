import { useLocation, useNavigate } from 'react-router-dom';

import { ORD_IO_URL } from '@shared/constants';
import { Inscription as InscriptionType } from '@shared/models/inscription.model';
import { RouteUrls } from '@shared/route-urls';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { convertInscriptionToSupportedInscriptionType } from '@app/query/bitcoin/ordinals/inscription.hooks';
import { OrdinalAvatarIcon } from '@app/ui/components/avatar/ordinal-avatar-icon';

import { CollectibleAudio } from '../_collectible-types/collectible-audio';
import { CollectibleIframe } from '../_collectible-types/collectible-iframe';
import { CollectibleImage } from '../_collectible-types/collectible-image';
import { CollectibleOther } from '../_collectible-types/collectible-other';
import { InscriptionText } from './inscription-text';

interface InscriptionProps {
  rawInscription: InscriptionType;
}

function openInscriptionUrl(num: number) {
  return openInNewTab(`${ORD_IO_URL}/${num}`);
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
          contentSrc={inscription.contentSrc}
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
