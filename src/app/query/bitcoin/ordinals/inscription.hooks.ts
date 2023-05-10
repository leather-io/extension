import {
  Inscription,
  SupportedInscription,
  whenInscriptionType,
} from '@shared/models/inscription.model';

import { useGetInscriptionQuery } from './inscription.query';

function createInfoUrl(id: string) {
  return `https://ordinals.hiro.so/inscription/${id}`;
}

export function convertInscriptionToSupportedInscriptionType(inscription: Inscription) {
  const title = `Inscription ${inscription.number}`;
  return whenInscriptionType<SupportedInscription>(inscription.content_type, {
    image: () => ({
      infoUrl: createInfoUrl(inscription.id),
      src: `https://api.hiro.so/ordinals/v1/inscriptions/${inscription.id}/content`,
      type: 'image',
      title,
      ...inscription,
    }),
    text: () => ({
      contentSrc: `https://api.hiro.so/ordinals/v1/inscriptions/${inscription.id}/content`,
      infoUrl: createInfoUrl(inscription.id),
      type: 'text',
      title,
      ...inscription,
    }),
    other: () => ({
      infoUrl: createInfoUrl(inscription.id),
      type: 'other',
      title,
      ...inscription,
    }),
  });
}

export function useInscription(path: string) {
  return useGetInscriptionQuery(path, {
    select: resp => convertInscriptionToSupportedInscriptionType(resp),
  });
}
