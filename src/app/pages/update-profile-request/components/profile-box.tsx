import { Image } from '@app/components/image';
import { Person, Profile } from '@stacks/profile';
import { color, Stack, Text } from '@stacks/ui';
import { ProfileUpdatingSelectors } from '@tests/integration/profile/profile-updating.selector';

const DEFAULT_AVATAR_URL = 'https://github.com/stacks-network.png';

function Value({ v }: { v: any }) {
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
    return <>{v}</>;
  } else if (v instanceof Array) {
    return (
      <div style={{ textIndent: '0em' }}>
        {v.map((entry, index) => (
          <div key={index}>
            <Value v={entry} />
            <hr />
          </div>
        ))}
      </div>
    );
  } else if (typeof v === 'object') {
    return <Properties p={v} />;
  } else {
    return <>{JSON.stringify(v)}</>;
  }
}

function Properties({ p }: { p: any }) {
  return (
    <>
      {Object.keys(p)
        .filter(k => !k.startsWith('@'))
        .map(k => {
          return (
            <div key={k} style={{ textIndent: '-2em', marginLeft: '2em' }}>
              <strong>{k}</strong> <Value v={p[k]} />
            </div>
          );
        })}
    </>
  );
}

export function ProfileBox({ profile }: { profile: Profile }): JSX.Element | null {
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
              {profile instanceof Person && (
                <>
                  <Text display="block" fontSize={2} lineHeight="1.6" wordBreak="break-all">
                    <h2>
                      <Text
                        data-testid={ProfileUpdatingSelectors.ProfileName}
                        color={color('text-caption')}
                      >
                        New details for {profile.name()}
                      </Text>
                    </h2>
                    <hr style={{ marginTop: '5px', marginBottom: '5px' }} />
                    {profile.avatarUrl() && (
                      <Image src={profile.avatarUrl() || DEFAULT_AVATAR_URL} />
                    )}
                  </Text>
                </>
              )}
              <>
                <Properties p={profile._profile} />
              </>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
