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
    imgSrc: 'assets/images/promo-banner/promo-banner-1.png',
    linkUrl: 'https://leather.io/wallet/mobile',
  },
  {
    eventName: 'stacking',
    message: 'Lock STX, earn BTC. 6–10% historical yields',
    imgSrc: 'assets/images/promo-banner/promo-banner-2.png',
    linkUrl: 'https://app.leather.io/stacking',
  },
  {
    eventName: 'sbtc',
    message: 'Grow your BTC up to 8% with direct wallet payouts',
    imgSrc: 'assets/images/promo-banner/promo-banner-3.png',
    linkUrl: 'https://app.leather.io/sbtc',
  },
];

export function PromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [promoIndexes, setPromoIndexes] = useState<number[]>([]);
  const [direction, setDirection] = useState<'idle' | 'forward' | 'backward'>('forward');
  const { dismissPromo, dismissedPromoIndexes } = usePromos();
  const shouldDisplayPromoCard = useConfigPromoCardEnabled();

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
    setDirection('idle');
  }

  function onGoForward() {
    setDirection('forward');
    setCurrentIndex(prev => Math.min(prev + 1, visibleIndexes.length - 1));
  }

  function onGoBackward() {
    setDirection('backward');
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
          direction={direction}
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
