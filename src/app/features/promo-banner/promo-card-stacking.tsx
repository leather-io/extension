import { styled } from 'leather-styles/jsx';

import { useThemeSwitcher } from '@app/common/theme-provider';

import { PromoCardLayout } from './promo-card.layout';

const leatherWebAppStackingUrl = 'https://app.leather.io/stacking';

interface PromoCardStackingProps {
  onDismiss(): void;
}
export function PromoCardStacking({ onDismiss }: PromoCardStackingProps) {
  const { theme } = useThemeSwitcher();
  const invertStyle = theme === 'light' ? {} : { filter: 'invert()' };

  return (
    <PromoCardLayout
      img={
        <styled.img
          alt="Stacking promo"
          src="assets/images/promo-banner/promo-banner-2.png"
          height={70}
          width={100}
          style={invertStyle}
        />
      }
      message="Lock STX, earn BTC. 6–10% historical yields"
      onClose={onDismiss}
      url={leatherWebAppStackingUrl}
    />
  );
}
