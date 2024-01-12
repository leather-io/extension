import { Box, Flex } from 'leather-styles/jsx';

interface PasswordStrengthBarsProps {
  bars: string[];
}
export function PasswordStrengthBars({ bars }: PasswordStrengthBarsProps) {
  return (
    <Flex display="flex" flexDirection="row" height="6px">
      {bars.map((bar: string, index: number) => {
        return (
          <Box
            borderRadius="xs"
            flexGrow={1}
            key={index}
            marginBottom="0"
            marginInline={index < bars.length - 1 ? '0 8px' : 0}
            marginTop="0"
            style={{
              backgroundColor: bar,
            }}
          />
        );
      })}
    </Flex>
  );
}
