import { useState } from 'react';

import { useConfigPromoCardEnabled } from '@app/query/common/remote-config/remote-config.query';

import { PromoCardMobile } from './promo-card-mobile';
import { PromoCardSbtc } from './promo-card-sbtc';
import { PromoCardStacking } from './promo-card-stacking';

export function PromoBanner() {
  const [cardIndex, setCardIndex] = useState(0);
  const shouldDisplayPromoCard = useConfigPromoCardEnabled();
  if (!shouldDisplayPromoCard) return null;
  return [
    <PromoCardMobile key={1} onDismiss={() => setCardIndex(cardIndex + 1)} />,
    <PromoCardStacking key={2} onDismiss={() => setCardIndex(cardIndex + 1)} />,
    <PromoCardSbtc key={2} onDismiss={() => setCardIndex(cardIndex + 1)} />,
  ];
}
