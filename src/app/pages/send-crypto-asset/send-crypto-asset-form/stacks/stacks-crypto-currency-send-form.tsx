import { useTransferableCryptoAssetBalance } from '@app/common/hooks/use-transferable-asset-balances.hooks';

interface StacksCryptoCurrencySendFormProps {}
export function StacksCryptoCurrencySendForm({}: StacksCryptoCurrencySendFormProps) {
  const balance = useTransferableCryptoAssetBalance('STX');
  return (
    <>
      STX Send Form <br />
      <pre>{JSON.stringify(balance, null, 2)}</pre>
    </>
  );
}
