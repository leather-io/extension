import { Grid, GridItem } from 'leather-styles/jsx';

interface AssetRowGridProps {
  title: React.ReactNode;
  balance: React.ReactNode;
  caption: React.ReactNode;
  usdBalance?: React.ReactNode;
  connectBtn?: React.ReactNode;
}
export function AssetRowGrid({
  title,
  balance,
  caption,
  usdBalance,
  connectBtn,
}: AssetRowGridProps) {
  const balanceItem = connectBtn ? (
    <GridItem rowSpan={2} display="flex" justifyContent="end">
      {connectBtn}
    </GridItem>
  ) : (
    <GridItem textAlign="right">{balance}</GridItem>
  );
  return (
    <Grid columns={2} gridTemplateColumns="2fr 1fr" gridTemplateRows={2} gap={0}>
      <GridItem textAlign="left" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
        {title}
      </GridItem>
      {balanceItem}
      <GridItem textAlign="left">{caption}</GridItem>
      {usdBalance && <GridItem>{usdBalance}</GridItem>}
    </Grid>
  );
}
