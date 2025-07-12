import { useMemo, useState } from 'react';

import { useOnMount } from '@leather.io/ui';

import { useConfigPromoCardEnabled } from '@app/query/common/remote-config/remote-config.query';

import { PromoBannerNavbar } from './promo-banner-navbar';
import { PromoCardLayout } from './promo-card.layout';
import { usePromos } from './use-promos';

const promoCards = [
  {
    message: 'Mobile app is here for iOS and Android',
    imgSrc: 'assets/images/promo-banner/promo-banner-1.png',
    linkUrl: 'https://leather.io/wallet/mobile',
  },
  {
    message: 'Lock STX, earn BTC. 6–10% historical yields',
    imgSrc: 'assets/images/promo-banner/promo-banner-2.png',
    linkUrl: 'https://app.leather.io/stacking',
  },
  {
    message: 'Grow your BTC up to 8% with direct wallet payouts',
    imgSrc: 'assets/images/promo-banner/promo-banner-3.png',
    linkUrl: 'https://app.leather.io/sbtc',
  },
];

export function PromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { initializePromos, dismissPromo, promoIndexes, dismissedPromoIndexes } = usePromos();
  const shouldDisplayPromoCard = useConfigPromoCardEnabled();

  // Initialize promo indexes
  useOnMount(() => {
    if (promoCards.length > 0 && promoIndexes.length === 0) {
      initializePromos(promoCards.length);
    }
  });

  const visibleIndexes = useMemo(
    () => promoIndexes.filter(i => !dismissedPromoIndexes.includes(i)),
    [promoIndexes, dismissedPromoIndexes]
  );

  function handleDismissCurrentPromo() {
    const current = visibleIndexes[currentIndex];
    dismissPromo(current);

    const newVisibleIndexes = promoIndexes.filter(
      i => ![...dismissedPromoIndexes, current].includes(i)
    );

    const newIndex =
      currentIndex >= newVisibleIndexes.length
        ? Math.max(newVisibleIndexes.length - 1, 0)
        : currentIndex;

    setCurrentIndex(newIndex);
  }

  function onGoBackward() {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }

  function onGoForward() {
    setCurrentIndex(prev => Math.min(prev + 1, visibleIndexes.length - 1));
  }

  if (!shouldDisplayPromoCard || visibleIndexes.length === 0) return null;

  const currentPromoIndex = visibleIndexes[currentIndex];
  const currentPromo = promoCards[currentPromoIndex];

  return (
    <>
      <PromoCardLayout {...currentPromo} onDismiss={handleDismissCurrentPromo} />
      <PromoBannerNavbar
        currentIndex={currentPromoIndex}
        promoIndexes={promoIndexes}
        visibleIndexes={visibleIndexes}
        onSetCurrentIndex={index => setCurrentIndex(index)}
        onGoBackward={onGoBackward}
        onGoForward={onGoForward}
      />
    </>
  );
}
