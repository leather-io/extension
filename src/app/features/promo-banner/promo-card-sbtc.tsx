import { styled } from 'leather-styles/jsx';

import { useThemeSwitcher } from '@app/common/theme-provider';

import { PromoCardLayout } from './promo-card.layout';

const leatherWebAppStackingUrl = 'https://app.leather.io/sbtc';

interface PromoCardSbtcProps {
  onDismiss(): void;
}
export function PromoCardSbtc({ onDismiss }: PromoCardSbtcProps) {
  const { theme } = useThemeSwitcher();
  const invertStyle = theme === 'light' ? {} : { filter: 'invert()' };

  return (
    <PromoCardLayout
      img={
        <styled.img
          alt="Stacking promo"
          src="assets/images/promo-banner/promo-banner-3.png"
          height={70}
          width={100}
          style={invertStyle}
        />
      }
      message="Grow your BTC up to 8% with direct wallet payouts"
      onClose={onDismiss}
      url={leatherWebAppStackingUrl}
    />
  );
}
