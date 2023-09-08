import { styled } from 'leather-styles/jsx';
import { divider } from 'leather-styles/patterns';
import { token } from 'leather-styles/tokens';

// TODO check if this is deprecated by Stack/dividestyle

/* TODO need to refactor this to use Divider pattern OR try pass divideStyle
  test divider class is working https://panda-css.com/docs/concepts/patterns#divider 
   */

export function Divider() {
  return (
    <styled.span
      className={divider({
        orientation: 'horizontal',
        thickness: '1px',
        color: token('colors.accent.border-default'),
      })}
    />
  );
}
