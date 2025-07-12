import { styled } from 'leather-styles/jsx';

import { useThemeSwitcher } from '@app/common/theme-provider';

import { PromoCardLayout } from './promo-card.layout';

const leatherWebAppMobileUrl = 'https://leather.io/wallet/mobile';

interface PromoCardMobileProps {
  onDismiss(): void;
}
export function PromoCardMobile({ onDismiss }: PromoCardMobileProps) {
  const { theme } = useThemeSwitcher();
  const invertStyle = theme === 'light' ? {} : { filter: 'invert()' };

  return (
    <PromoCardLayout
      img={
        <styled.img
          alt="Mobile app promo"
          src="assets/images/promo-banner/promo-banner-1.png"
          height={70}
          width={100}
          style={invertStyle}
        />
      }
      message="Mobile app is here for iOS and Android"
      onClose={onDismiss}
      url={leatherWebAppMobileUrl}
    />
  );
}
