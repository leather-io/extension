import { styled } from 'leather-styles/jsx';

export function ViewSecretKeyContent(): React.JSX.Element {
  return (
    <>
      <styled.h1
        textStyle={['heading.03', 'heading.03', 'heading.03', 'display.02']}
        mt="space.00"
        mb="space.06"
      >
        Your <br /> Secret Key
      </styled.h1>
      <styled.p textStyle={['label.01', 'heading.05']}>
        These 24 words are your Secret Key. They create your account, and you sign in on different
        devices with them. Make sure to save these somewhere safe.
      </styled.p>

      <br />
      <styled.p textStyle={['label.01', 'heading.05']} mb="space.06">
        If you lose these words, you lose your account.
      </styled.p>
    </>
  );
}
