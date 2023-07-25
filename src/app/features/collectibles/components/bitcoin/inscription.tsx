import { useNavigate } from 'react-router-dom';

import { Inscription as InscriptionType } from '@shared/models/inscription.model';
import { RouteUrls } from '@shared/route-urls';

import { useLocationState } from '@app/common/hooks/use-location-state';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { OrdinalIconFull } from '@app/components/icons/ordinal-icon-full';
import { OrdinalMinimalIcon } from '@app/components/icons/ordinal-minimal-icon';
import { convertInscriptionToSupportedInscriptionType } from '@app/query/bitcoin/ordinals/inscription.hooks';

import { CollectibleImage } from '../_collectible-types/collectible-image';
import { CollectibleOther } from '../_collectible-types/collectible-other';
import { InscriptionText } from './inscription-text';

interface InscriptionProps {
  rawInscription: InscriptionType;
}
export function Inscription({ rawInscription }: InscriptionProps) {
  const inscription = convertInscriptionToSupportedInscriptionType(rawInscription);
  const navigate = useNavigate();
  const backgroundLocation = useLocationState('backgroundLocation');

  function openSendInscriptionModal() {
    navigate(RouteUrls.SendOrdinalInscription, {
      state: { inscription, backgroundLocation },
    });
  }

  switch (inscription.type) {
    case 'image': {
      return (
        <CollectibleImage
          icon={<OrdinalMinimalIcon />}
          key={inscription.title}
          onClickCallToAction={() => openInNewTab(inscription.infoUrl)}
          onClickSend={() => openSendInscriptionModal()}
          src={inscription.src}
          subtitle="Ordinal inscription"
          title={`# ${inscription.number}`}
        />
      );
    }
    case 'text': {
      return (
        <InscriptionText
          contentSrc={inscription.contentSrc}
          inscriptionNumber={inscription.number}
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
          title={`# ${inscription.number}`}
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
