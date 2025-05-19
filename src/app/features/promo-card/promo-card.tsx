import { Box, styled } from 'leather-styles/jsx';

import { Flag, type FlagProps } from '@leather.io/ui';

import { useConfigPromoCardEnabled } from '@app/query/common/remote-config/remote-config.query';

interface PromoCardContentProps extends FlagProps {}

function PromoCardLayout(props: PromoCardContentProps) {
  return (
    <Flag
      cursor="pointer"
      reverse
      img={
        <styled.img
          alt="Grow your bitcoin in our new web app"
          src="assets/illustrations/grow-your-bitcoin.png"
          width={70}
          mr="space.02"
        />
      }
      background="ink.action-primary-default"
      borderRadius={8}
      mt="space.05"
      pt="space.02"
      px="space.02"
      {...props}
    >
      <Box pl="space.03" pt="space.02" pb="space.04">
        <styled.h3
          textStyle="heading.05"
          fontSize="17px"
          lineHeight={1.4}
          color="ink.background-primary"
        >
          Grow your Bitcoin
        </styled.h3>
        <styled.p textStyle="label.03" mt="space.01" color="ink.background-primary">
          Our new web app is live and built to help you earn with Bitcoin.
        </styled.p>
      </Box>
    </Flag>
  );
}

export function PromoCard(props: FlagProps) {
  const shouldDisplayPromoCard = useConfigPromoCardEnabled();
  if (!shouldDisplayPromoCard) return null;
  return <PromoCardLayout {...props} />;
}
