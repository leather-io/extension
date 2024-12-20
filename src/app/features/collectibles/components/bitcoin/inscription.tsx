import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box } from 'leather-styles/jsx';
import { useHover } from 'use-events';

import { type Inscription } from '@leather.io/models';
import {
  DropdownMenu,
  EllipsisVIcon,
  ExternalLinkIcon,
  Flag,
  IconButton,
  OrdinalAvatarIcon,
  TrashIcon,
} from '@leather.io/ui';

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

  const { hasInscriptionBeenDiscarded, discardInscription, recoverInscription } =
    useDiscardedInscriptions();

  const openSendInscriptionModal = useCallback(() => {
    navigate(RouteUrls.SendOrdinalInscription, {
      state: { inscription, backgroundLocation: location },
    });
  }, [navigate, inscription, location]);

  const [isHovered, bind] = useHover();

  const content = useMemo(() => {
    const sharedProps = { onClickSend: () => openSendInscriptionModal() };
    switch (inscription.mimeType) {
      case 'audio':
        return (
          <CollectibleAudio
            icon={<OrdinalAvatarIcon size="lg" />}
            key={inscription.title}
            subtitle="Ordinal inscription"
            title={`# ${inscription.number}`}
            {...sharedProps}
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
            src={inscription.src}
            subtitle="Ordinal inscription"
            title={`# ${inscription.number}`}
            {...sharedProps}
          />
        );
      case 'image':
        return (
          <CollectibleImage
            icon={<OrdinalAvatarIcon size="lg" />}
            key={inscription.title}
            src={inscription.src}
            subtitle="Ordinal inscription"
            title={`# ${inscription.number}`}
            {...sharedProps}
          />
        );
      case 'text':
        return (
          <InscriptionText
            contentSrc={inscription.src}
            inscriptionNumber={inscription.number}
            {...sharedProps}
          />
        );
      case 'other':
        return (
          <CollectibleOther
            key={inscription.title}
            subtitle="Ordinal inscription"
            title={`# ${inscription.number}`}
            {...sharedProps}
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
    <Box position="relative" {...bind} opacity={hasInscriptionBeenDiscarded(inscription) ? 0.5 : 1}>
      {content}
      <Box
        bg="ink.background-primary"
        position="absolute"
        right="12px"
        top="12px"
        zIndex={hasInscriptionBeenDiscarded(inscription) ? 9999999999 : 1}
      >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton
              _focus={{ outline: 'focus' }}
              _hover={{ bg: 'ink.component-background-hover' }}
              bg="ink.background-primary"
              transform="rotate(90deg)"
              color="ink.action-primary-default"
              icon={<EllipsisVIcon variant="small" />}
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content side="bottom" style={{ marginRight: '96px' }}>
            <DropdownMenu.Item onClick={() => openInscriptionUrl(inscription.number)}>
              <Flag img={<ExternalLinkIcon variant="small" />}>Open original</Flag>
            </DropdownMenu.Item>
            {hasInscriptionBeenDiscarded(inscription) ? (
              <DropdownMenu.Item onClick={() => recoverInscription(inscription)}>
                <Flag img={<TrashIcon variant="small" />}>Protect</Flag>
              </DropdownMenu.Item>
            ) : (
              <DropdownMenu.Item onClick={() => discardInscription(inscription)}>
                <Flag img={<TrashIcon variant="small" />}>Unprotect</Flag>
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box>
      <HighSatValueUtxoWarning inscription={inscription} />
      IsDiscarded: {String(hasInscriptionBeenDiscarded(inscription))}
      <br />
      is hovered: {String(isHovered)}
      <br />
      value: {inscription.value}
      <br />
      <button
        onClick={() => {
          // change api to use txid and output obj
          hasInscriptionBeenDiscarded(inscription)
            ? recoverInscription(inscription)
            : discardInscription(inscription);
        }}
      >
        toggle safe to spend
      </button>
      <br />
    </Box>
  );
}
