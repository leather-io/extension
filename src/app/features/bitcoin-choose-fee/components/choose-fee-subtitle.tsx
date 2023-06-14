import { Text, color } from '@stacks/ui';

export function ChooseFeeSubtitle(props: { isSendingMax: boolean }) {
  const { isSendingMax } = props;

  const subtitle = isSendingMax ? (
    'Chosen fee will affect your sending amount'
  ) : (
    <>
      Fees are deducted from your balance,
      <br />
      it won't affect your sending amount.
    </>
  );

  return (
    <Text color={color('text-caption')} fontSize={1} lineHeight="20px" textAlign="center">
      {subtitle}
    </Text>
  );
}
