import {
  Inscription,
  SupportedInscription,
  whenInscriptionType,
} from '@shared/models/inscription.model';

import { useGetInscriptionQuery } from './inscription.query';

export function createInscriptionInfoUrl(id: string) {
  return `https://ordinals.hiro.so/inscription/${id}`;
}

export function convertInscriptionToSupportedInscriptionType(inscription: Inscription) {
  const title = `Inscription ${inscription.number}`;
  return whenInscriptionType<SupportedInscription>(inscription.content_type, {
    image: () => ({
      infoUrl: createInscriptionInfoUrl(inscription.id),
      src: `https://api.hiro.so/ordinals/v1/inscriptions/${inscription.id}/content`,
      type: 'image',
      title,
      ...inscription,
    }),
    text: () => ({
      contentSrc: `https://api.hiro.so/ordinals/v1/inscriptions/${inscription.id}/content`,
      infoUrl: createInscriptionInfoUrl(inscription.id),
      type: 'text',
      title,
      ...inscription,
    }),
    other: () => ({
      infoUrl: createInscriptionInfoUrl(inscription.id),
      type: 'other',
      title,
      ...inscription,
    }),
  });
}

export function useInscription(id: string) {
  return useGetInscriptionQuery(id, {
    select: resp => convertInscriptionToSupportedInscriptionType(resp),
  });
}
