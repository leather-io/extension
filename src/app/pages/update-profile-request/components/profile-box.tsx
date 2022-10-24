import { Profile } from '@stacks/profile';
import { color, Stack } from '@stacks/ui';

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
            <div key={k} style={{ textIndent: '-1em', marginLeft: '1em' }}>
              <span style={{ color: color('text-caption') }}>{k}:</span> <Value v={p[k]} />
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
              <Properties p={profile._profile} />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
