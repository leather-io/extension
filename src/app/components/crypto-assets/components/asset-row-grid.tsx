import { Grid, GridItem } from 'leather-styles/jsx';

interface AssetRowGridProps {
  title: React.ReactNode;
  balance: React.ReactNode;
  caption: React.ReactNode;
  usdBalance?: React.ReactNode;
}
export function AssetRowGrid({ title, balance, caption, usdBalance }: AssetRowGridProps) {
  return (
    <Grid columns={2} gridTemplateColumns="2fr 1fr" gridTemplateRows={2} gap={0}>
      <GridItem whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
        {title}
      </GridItem>
      <GridItem textAlign="right">{balance}</GridItem>
      <GridItem>{caption}</GridItem>
      {usdBalance && <GridItem>{usdBalance}</GridItem>}
    </Grid>
  );
}
