import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, styled } from 'leather-styles/jsx';

import { type Inscription } from '@leather.io/models';
import {
  DropdownMenu,
  EllipsisVIcon,
  ExternalLinkIcon,
  Flag,
  IconButton,
  LockIcon,
  OrdinalAvatarIcon,
  TrashIcon,
  UnlockIcon,
} from '@leather.io/ui';

import { ORD_IO_URL } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';

import { useHoverWithChildren } from '@app/common/hooks/use-hover-with-children';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useDiscardedInscriptions } from '@app/store/settings/settings.selectors';

import { CollectibleAudio } from '../../../../components/collectibles/collectible-audio';
import { CollectibleIframe } from '../../../../components/collectibles/collectible-iframe';
import { CollectibleImage } from '../../../../components/collectibles/collectible-image';
import { CollectibleOther } from '../../../../components/collectibles/collectible-other';
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
  const [isHovered, bind] = useHoverWithChildren();
  const { hasInscriptionBeenDiscarded, discardInscription, recoverInscription } =
    useDiscardedInscriptions();

  const openSendInscriptionModal = useCallback(() => {
    navigate(RouteUrls.SendOrdinalInscription, {
      state: { inscription, backgroundLocation: location },
    });
  }, [navigate, inscription, location]);

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
    <Box position="relative" {...bind}>
      <Box opacity={hasInscriptionBeenDiscarded(inscription) ? 0.5 : 1}>{content}</Box>
      {isHovered && (
        <Box
          border="1px solid"
          borderColor="ink.text-primary"
          borderRadius="2px"
          bg="ink.background-primary"
          position="absolute"
          right="space.03"
          top="space.03"
          zIndex="900"
        >
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton
                _focus={{ outline: 'focus' }}
                _hover={{ bg: 'ink.component-background-hover' }}
                bg="ink.background-primary"
                transform="rotate(90deg)"
                color="ink.action-primary-default"
                icon={<EllipsisVIcon />}
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              align="end"
              side="bottom"
              sideOffset={4}
              style={{ padding: '8px' }}
            >
              <DropdownMenu.Item onClick={() => openInscriptionUrl(inscription.number)}>
                <Flag img={<ExternalLinkIcon />}>
                  <styled.span textStyle="label.02">Open original</styled.span>
                </Flag>
              </DropdownMenu.Item>
              {hasInscriptionBeenDiscarded(inscription) ? (
                <DropdownMenu.Item onClick={() => recoverInscription(inscription)}>
                  <Flag img={<LockIcon />}>
                    <styled.span textStyle="label.02">Protect</styled.span>
                  </Flag>
                </DropdownMenu.Item>
              ) : (
                <DropdownMenu.Item onClick={() => discardInscription(inscription)}>
                  <Flag img={<UnlockIcon />}>
                    <styled.span textStyle="label.02">Unprotect</styled.span>
                  </Flag>
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Box>
      )}

      <HighSatValueUtxoWarning inscription={inscription} />

      {hasInscriptionBeenDiscarded(inscription) && (
        <Box
          p="space.02"
          borderRadius="xs"
          border="1px solid"
          borderColor="ink.border-transparent"
          background="ink.background-secondary"
          position="absolute"
          bottom="134px"
          left="18px"
        >
          <Flag opacity={0.5} spacing="space.01" img={<TrashIcon variant="small" />}>
            Unprotected
          </Flag>
        </Box>
      )}
    </Box>
  );
}
