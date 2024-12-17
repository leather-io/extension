import { Box, styled } from 'leather-styles/jsx';

import { Flag, type FlagProps } from '@leather.io/ui';

import { useThemeSwitcher } from '@app/common/theme-provider';
import { useConfigSbtc } from '@app/query/common/remote-config/remote-config.query';

interface SbtcPromoCardContentProps extends FlagProps {}

function SbtcPromoCardLayout(props: SbtcPromoCardContentProps) {
  const { theme } = useThemeSwitcher();
  const invertStyle = theme === 'light' ? '' : 'invert()';

  return (
    <Flag
      cursor="pointer"
      reverse
      img={
        <styled.img
          src="assets/illustrations/sbtc-earn-promo.svg"
          width={100}
          filter={invertStyle}
          mr="space.03"
        />
      }
      background="ink.background-secondary"
      borderRadius={8}
      {...props}
    >
      <Box pl="space.04" py="space.04">
        <styled.h3 textStyle="heading.05" fontSize="17px" lineHeight={1.4}>
          Earn rewards in BTC
        </styled.h3>
        <styled.p textStyle="label.03" mt="space.01">
          Enroll your sBTC to unlock yields through the protocol.
        </styled.p>
      </Box>
    </Flag>
  );
}

export function SbtcPromoCard(props: FlagProps) {
  const { shouldDisplayPromoCard } = useConfigSbtc();
  if (!shouldDisplayPromoCard) return null;
  return <SbtcPromoCardLayout {...props} />;
}
