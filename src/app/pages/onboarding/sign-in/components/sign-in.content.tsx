import { styled } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';

export function SignInContent({
  onClick,
  twentyFourWordMode,
}: {
  onClick: () => void;
  twentyFourWordMode: boolean;
}): React.JSX.Element {
  return (
    <>
      <styled.h1 textStyle={['heading.03', 'heading.03', 'heading.03', 'display.02']} mt="space.00">
        Sign in with your Secret Key
      </styled.h1>
      <styled.p textStyle={['label.01', 'heading.05']} mb="space.02">
        Enter your Secret Key to sign in with an existing wallet
      </styled.p>
      <styled.span textStyle="body.02">
        Tip: You can paste in your entire Secret Key at once
      </styled.span>
      <LeatherButton
        mt="space.03"
        variant="link"
        textStyle="label.01"
        width="fit-content"
        onClick={onClick}
      >
        {twentyFourWordMode ? 'Have a 12-word Secret Key?' : 'Use 24 word Secret Key'}
      </LeatherButton>
    </>
  );
}
