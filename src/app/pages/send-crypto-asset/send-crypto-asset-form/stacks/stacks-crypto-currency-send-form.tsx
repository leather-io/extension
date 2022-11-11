import { useTransferableCryptoAssetBalance } from '../../crypto-assets.hooks';

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
