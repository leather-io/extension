import {
  Inscription,
  SupportedInscription,
  whenInscriptionType,
} from '@shared/models/inscription.model';

import { useGetInscriptionQuery } from './inscription.query';

function createInfoUrl(contentPath: string) {
  return `https://ordinals.hiro.so${contentPath}`.replace('content', 'inscription');
}

function convertInscriptionToSupportedInscriptionType(inscription: Inscription) {
  return whenInscriptionType<SupportedInscription>(inscription.content_type, {
    image: () => ({
      infoUrl: createInfoUrl(inscription.content),
      src: `https://ordapi.xyz${inscription.content}`,
      type: 'image',
      ...inscription,
    }),
    text: () => ({
      contentSrc: `https://ordapi.xyz${inscription.content}`,
      infoUrl: createInfoUrl(inscription.content),
      type: 'text',
      ...inscription,
    }),
    other: () => ({
      infoUrl: createInfoUrl(inscription.content),
      type: 'other',
      ...inscription,
    }),
  });
}

export function useInscription(path: string) {
  return useGetInscriptionQuery(path, {
    select: resp => convertInscriptionToSupportedInscriptionType(resp),
  });
}
