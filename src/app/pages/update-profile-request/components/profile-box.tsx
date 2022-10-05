import { Image } from '@app/components/image';
import { color, Stack, Text } from '@stacks/ui';

export function ProfileBox({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl: string;
}): JSX.Element | null {
  return (
    <>
      <Stack minHeight={'260px'}>
        <Stack
          border="4px solid"
          paddingBottom={'8px'}
          borderColor={color('border')}
          borderRadius="20px"
          backgroundColor={color('border')}
        >
          <Stack
            py="loose"
            px="loose"
            spacing="loose"
            borderRadius="16px"
            backgroundColor={'white'}
          >
            <Stack spacing="base-tight">
              <Text display="block" fontSize={2} lineHeight="1.6" wordBreak="break-all">
                <h2>
                  <strong>Update your Profile</strong>{' '}
                  <Text color={color('text-caption')}>{name}</Text>
                </h2>
                <hr style={{ marginTop: '5px', marginBottom: '5px' }} />
                <Image src={imageUrl} />
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
