import { styled } from 'leather-styles/jsx';

import { Link } from '@app/ui/components/link/link';

export function SignInContent({
  onClick,
  twentyFourWordMode,
}: {
  onClick(): void;
  twentyFourWordMode: boolean;
}): React.JSX.Element {
  return (
    <>
      <styled.h1 textStyle={['heading.03', 'heading.03', 'heading.03', 'display.02']} mt="space.00">
        Sign in <br /> with your <br />
        Secret Key
      </styled.h1>
      <styled.p textStyle={['label.01', 'heading.05']} my="space.05">
        Speed things up by pasting your entire Secret Key in one go.
      </styled.p>
      <Link onClick={onClick} size="lg" width="fit-content">
        {twentyFourWordMode ? 'Have a 12-word Secret Key?' : 'Use 24 word Secret Key'}
      </Link>
    </>
  );
}
