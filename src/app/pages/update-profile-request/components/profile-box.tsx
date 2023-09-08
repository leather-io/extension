import { Profile } from '@stacks/profile';
import { Box, Stack } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

function Value({ v }: { v: any }) {
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
    return <span style={{ wordBreak: 'break-all' }}>{v}</span>;
  } else if (v instanceof Array) {
    return (
      <>
        [
        <div style={{ textIndent: '0em' }}>
          {v.map((entry, index) => {
            return (
              <div key={index}>
                <Value v={entry} />
                {index < v.length - 1 && <>,</>}
              </div>
            );
          })}
        </div>
        ]
      </>
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
            <Box key={k} textIndent="-1em" ml="space.05">
              {/* TODO check color - text caption, mabe replace with styled.span variant */}
              <span style={{ color: token('colors.accent.text-primary') }}>{k}:</span>{' '}
              <Value v={p[k]} />
            </Box>
          );
        })}
    </>
  );
}

export function ProfileBox({ profile }: { profile: Profile }): React.JSX.Element | null {
  return (
    <Box minHeight={'260px'}>
      <Stack
        border="4px solid"
        paddingBottom={'8px'}
        borderColor={token('colors.accent.border-default')}
        borderRadius="20px"
        backgroundColor={token('colors.accent.border-default')}
      >
        <Box
          py="space.05"
          px="space.05"
          gap="space.05"
          borderRadius="16px"
          backgroundColor={'white'}
        >
          <Box gap="space.03">
            <Properties p={profile._profile} />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
