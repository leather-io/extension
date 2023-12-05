import { Grid } from 'leather-styles/jsx';

interface SecretKeyGridProps {
  children: React.ReactNode;
}
export function SecretKeyGrid({ children }: SecretKeyGridProps) {
  return (
    <Grid
      gridTemplateColumns={{
        base: 'repeat(1, minmax(160px, 1fr))',
        md: 'repeat(2, minmax(170px, 1fr))',
        lg: 'repeat(3, minmax(170px, 1fr))',
      }}
      rowGap="space.03"
      columnGap="space.03"
    >
      {children}
    </Grid>
  );
}
