import { Box, styled } from 'leather-styles/jsx';

import { analytics } from '@shared/utils/analytics';

import { useThemeSwitcher } from '@app/common/theme-provider';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';

import { PromoCardLayout } from './promo-card.layout';

interface PromoCardProps {
  currentIndex: number;
  eventName: string;
  message: string;
  imgSrc: string;
  linkUrl: string;
  onDismissCard(): void;
}
export function PromoCard({
  currentIndex,
  eventName,
  message,
  imgSrc,
  linkUrl,
  onDismissCard,
}: PromoCardProps) {
  const { theme } = useThemeSwitcher();
  const invertStyle = theme === 'light' ? {} : { filter: 'invert()' };

  function onClickCard() {
    void analytics.untypedTrack('promo_banner_clicked', { banner_name: eventName });
    openInNewTab(linkUrl);
  }

  return (
    <Box
      key={currentIndex}
      position="absolute"
      transition="transform 0.4s ease"
      willChange="transform"
      width="100%"
    >
      <PromoCardLayout
        img={<styled.img alt={message} src={imgSrc} height={70} width={100} style={invertStyle} />}
        message={message}
        onClickCard={onClickCard}
        onDismissCard={onDismissCard}
      />
    </Box>
  );
}
