import { styled } from 'leather-styles/jsx';

export function ChooseFeeSubtitle({ isSendingMax }: { isSendingMax: boolean }) {
  const subtitle = isSendingMax ? (
    'Chosen fee will affect your sending amount'
  ) : (
    <>
      Fees are deducted from your balance <br /> and will not affect your sending amount
    </>
  );

  return (
    <styled.span color="ink.text-subdued" textAlign="center" textStyle="caption.01">
      {subtitle}
    </styled.span>
  );
}
