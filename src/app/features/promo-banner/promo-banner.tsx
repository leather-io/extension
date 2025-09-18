import { useMemo, useState } from 'react';

import { Box } from 'leather-styles/jsx';

import { useOnMount } from '@leather.io/ui';

import { useConfigPromoCardEnabled } from '@app/query/common/remote-config/remote-config.query';

import { PromoBannerNavbar } from './promo-banner-navbar';
import { PromoCard } from './promo-card';
import { usePromos } from './use-promos';

const promoCards = [
  {
    eventName: 'mobile',
    message: 'Mobile app is here for iOS and Android',
    imgSrc: 'assets/illustrations/promo-banner-mobile.svg',
    linkUrl: 'https://leather.io/wallet/mobile',
  },
  {
    eventName: 'stacking',
    message: 'Lock STX, earn BTC',
    imgSrc: 'assets/illustrations/promo-banner-stacking.svg',
    linkUrl: 'https://app.leather.io/stacking',
  },
  {
    eventName: 'sbtc',
    message: 'Grow your sBTC',
    imgSrc: 'assets/illustrations/promo-banner-sbtc.svg',
    linkUrl: 'https://app.leather.io/sbtc',
  },
];

export function PromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [promoIndexes, setPromoIndexes] = useState<number[]>([]);
  const { dismissPromo, dismissedPromoIndexes } = usePromos();
  const shouldDisplayPromoCard = useConfigPromoCardEnabled();

  // console.log('shouldDisplayPromoCard', shouldDisplayPromoCard);

  useOnMount(() => {
    if (promoCards.length > 0 && promoIndexes.length === 0) {
      setPromoIndexes(Array.from({ length: promoCards.length }, (_, i) => i));
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

  function onGoForward() {
    setCurrentIndex(prev => Math.min(prev + 1, visibleIndexes.length - 1));
  }

  function onGoBackward() {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }

  if (!shouldDisplayPromoCard || visibleIndexes.length === 0) return null;

  const currentPromoIndex = visibleIndexes[currentIndex];
  const currentPromo = promoCards[currentPromoIndex];

  return (
    <Box position="relative" overflow="hidden">
      <Box position="relative" minHeight="78px">
        <PromoCard
          {...currentPromo}
          currentIndex={currentPromoIndex}
          onDismissCard={handleDismissCurrentPromo}
        />
      </Box>
      <PromoBannerNavbar
        currentIndex={currentPromoIndex}
        promoIndexes={promoIndexes}
        visibleIndexes={visibleIndexes}
        onSetCurrentIndex={index => setCurrentIndex(index)}
        onGoBackward={onGoBackward}
        onGoForward={onGoForward}
      />
    </Box>
  );
}
