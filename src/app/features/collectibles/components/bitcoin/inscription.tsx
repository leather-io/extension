import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box } from 'leather-styles/jsx';

import { type Inscription } from '@leather.io/models';
import { OrdinalAvatarIcon } from '@leather.io/ui';

import { ORD_IO_URL } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useDiscardedInscriptions } from '@app/store/settings/settings.selectors';

import { CollectibleAudio } from '../_collectible-types/collectible-audio';
import { CollectibleIframe } from '../_collectible-types/collectible-iframe';
import { CollectibleImage } from '../_collectible-types/collectible-image';
import { CollectibleOther } from '../_collectible-types/collectible-other';
import { HighSatValueUtxoWarning } from './high-sat-value-utxo';
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
  const {
    hasInscriptionBeenDiscarded: hasBeenDiscarded,
    discardInscription,
    recoverInscription,
    discardedInscriptions,
  } = useDiscardedInscriptions();

  // console.log(inscription);
  // console.log(discardedInscriptions);

  const openSendInscriptionModal = useCallback(() => {
    navigate(RouteUrls.SendOrdinalInscription, {
      state: { inscription, backgroundLocation: location },
    });
  }, [navigate, inscription, location]);

  const content = useMemo(() => {
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
  }, [
    inscription.mimeType,
    inscription.number,
    inscription.src,
    inscription.title,
    openSendInscriptionModal,
  ]);

  return (
    <Box position="relative">
      {content}
      <HighSatValueUtxoWarning inscription={inscription} />
      IsDiscarded:{' '}
      {String(hasBeenDiscarded(inscription.txid, inscription.output, inscription.offset))}
      <br />
      value: {inscription.value}
      <br />
      <button
        onClick={() => {
          // change api to use txid and output obj
          hasBeenDiscarded(inscription.txid, inscription.output, inscription.offset)
            ? recoverInscription(inscription.txid, inscription.output, inscription.offset)
            : discardInscription(inscription.txid, inscription.output, inscription.offset);
        }}
      >
        toggle safe to spend
      </button>
    </Box>
  );
}
