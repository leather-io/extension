import { Grid, Stack } from 'leather-styles/jsx';

interface SecretKeyGridProps {
  children: React.ReactNode;
}
export function SecretKeyGrid({ children }: SecretKeyGridProps) {
  return (
    <Stack gap="space.03" mb="space.05" width="100%">
      <Grid
        gridTemplateColumns={[
          'repeat(2, minmax(160px, 1fr))',
          'repeat(2, minmax(170px, 1fr))',
          'repeat(2, minmax(170px, 1fr))',
          'repeat(3, minmax(170px, 1fr))',
        ]}
        rowGap="space.03"
        columnGap="space.03"
        margin={['auto', 'auto', 'auto', 'unset']}
      >
        {children}
      </Grid>
    </Stack>
  );
}
