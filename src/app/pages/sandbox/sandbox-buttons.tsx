import { Flex, Stack } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';

const variants = ['solid', 'outline', 'ghost', 'link', 'text'];

export function SandboxButtons() {
  return (
    <Stack gap="space.07">
      {variants.map((variant: any) => (
        <Flex alignItems="center" gap="space.03" key={variant}>
          variant: {variant}
          <LeatherButton variant={variant}>Button</LeatherButton>
        </Flex>
      ))}
    </Stack>
  );
}
