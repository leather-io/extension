import { styled } from 'leather-styles/jsx';

interface PasswordStrengthBarsProps {
  bars: string[];
}
export function PasswordStrengthBars({ bars }: PasswordStrengthBarsProps) {
  return (
    <styled.div display="flex" flexDirection="row" height="6px">
      {bars.map((bar: string, index: number) => {
        return (
          <styled.span
            key={index}
            bg={bar}
            marginTop="0"
            marginBottom="0"
            marginInline={index < bars.length - 1 ? '0 8px' : 0}
            borderRadius="2px"
            flexGrow={1}
          />
        );
      })}
    </styled.div>
  );
}
