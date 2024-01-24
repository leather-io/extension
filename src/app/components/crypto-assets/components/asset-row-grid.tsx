import { Grid, GridItem } from 'leather-styles/jsx';

interface AssetRowGridProps {
  title: React.ReactNode;
  balance: React.ReactNode;
  caption: React.ReactNode;
  usdBalance?: React.ReactNode;
  rightElement?: React.ReactNode;
}
export function AssetRowGrid({
  title,
  balance,
  caption,
  usdBalance,
  rightElement,
}: AssetRowGridProps) {
  const balanceItem = rightElement ? (
    <GridItem rowSpan={2} display="flex" justifyContent="end">
      {rightElement}
    </GridItem>
  ) : (
    <GridItem textAlign="right">{balance}</GridItem>
  );
  return (
    <Grid
      columns={2}
      gridTemplateColumns="2fr 1fr"
      gridTemplateRows={2}
      gap={0}
      whiteSpace="nowrap"
    >
      <GridItem textAlign="left" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
        {title}
      </GridItem>
      {balanceItem}
      <GridItem textAlign="left">{caption}</GridItem>
      {usdBalance && <GridItem>{usdBalance}</GridItem>}
    </Grid>
  );
}
