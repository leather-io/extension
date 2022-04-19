import { Flex, Stack, Text } from '@stacks/ui';

import { AppIcon } from '@app/components/app-icon';
import { Title } from '@app/components/typography';

interface AccountPickerLayoutProps {
  appName?: string;
  children: React.ReactNode;
}
export function AccountPickerLayout(props: AccountPickerLayoutProps) {
  const { appName, children } = props;
  return (
    <Flex flexDirection="column" px={['loose', 'unset']} width="100%">
      <Stack spacing="loose" textAlign="center">
        <AppIcon mt="extra-loose" mb="loose" size="72px" />
        <Stack spacing="base">
          <Title fontSize={4}>Choose an account</Title>
          <Text textStyle="caption">to connect to {appName}</Text>
        </Stack>
      </Stack>
      {children}
    </Flex>
  );
}
