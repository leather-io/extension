import { css } from 'leather-styles/css';
import { Box, styled } from 'leather-styles/jsx';

import { analytics } from '@shared/utils/analytics';

import { useThemeSwitcher } from '@app/common/theme-provider';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';

import { PromoCardLayout } from './promo-card.layout';

const slideLeft = css({
  animation: 'slideInFromRight 0.4s ease-out forwards',
});

const slideRight = css({
  animation: 'slideInFromLeft 0.4s ease-out forwards',
});

interface PromoCardProps {
  currentIndex: number;
  direction: 'idle' | 'forward' | 'backward';
  eventName: string;
  message: string;
  imgSrc: string;
  linkUrl: string;
  onDismissCard(): void;
}
export function PromoCard({
  currentIndex,
  direction,
  eventName,
  message,
  imgSrc,
  linkUrl,
  onDismissCard,
}: PromoCardProps) {
  const { theme } = useThemeSwitcher();
  const invertStyle = theme === 'light' ? {} : { filter: 'invert()' };
  const isIdle = direction === 'idle';

  function onClickCard() {
    void analytics.untypedTrack('promo_banner_clicked', { banner_name: eventName });
    openInNewTab(linkUrl);
  }

  return (
    <>
      <Box
        key={currentIndex}
        className={isIdle ? '' : direction === 'forward' ? slideLeft : slideRight}
        position="absolute"
        transition="transform 0.4s ease"
        willChange="transform"
        width="100%"
      >
        <PromoCardLayout
          img={
            <styled.img alt={message} src={imgSrc} height={70} width={100} style={invertStyle} />
          }
          message={message}
          onClickCard={onClickCard}
          onDismissCard={onDismissCard}
        />
      </Box>

      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
