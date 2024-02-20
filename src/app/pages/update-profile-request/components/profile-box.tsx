import { Profile } from '@stacks/profile';
import { Box, Stack, styled } from 'leather-styles/jsx';

function Value({ v }: { v: any }) {
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
    return (
      <styled.span textStyle="caption.01" wordBreak="break-all">
        {v}
      </styled.span>
    );
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
              <styled.span textStyle="caption.01">{k}:</styled.span> <Value v={p[k]} />
            </Box>
          );
        })}
    </>
  );
}

export function ProfileBox({ profile }: { profile: Profile }): React.JSX.Element | null {
  return (
    <Box minHeight="260px">
      <Box
        bg="ink.background-primary"
        border="active"
        borderRadius="sm"
        px="space.05"
        py="space.05"
      >
        <Stack gap="space.03">
          <Properties p={profile._profile} />
        </Stack>
      </Box>
    </Box>
  );
}
