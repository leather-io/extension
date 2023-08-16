import { styled } from 'leaf-styles/jsx';

export function ChooseFeeSubtitle({ isSendingMax }: { isSendingMax: boolean }) {
  const subtitle = isSendingMax ? (
    'Chosen fee will affect your sending amount'
  ) : (
    <>
      Fees are deducted from your balance <br /> and will not affect your sending amount
    </>
  );

  return (
    <styled.span textStyle="caption.02" textAlign="center">
      {subtitle}
    </styled.span>
  );
}
