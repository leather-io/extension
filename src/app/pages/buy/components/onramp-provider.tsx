import { makeMoonPayUrl } from '@app/features/fiat-onramp-providers/moonpay-helper';
import { makeOkcoinUrl } from '@app/features/fiat-onramp-providers/okcoin-helper';
import { makeTransakUrl } from '@app/features/fiat-onramp-providers/transak-helper';
import {
  useActiveFiatProviders,
  useHasFiatProviders,
} from '@app/query/hiro-config/hiro-config.query';
import { OnrampProviderLayout, ProvidersUrl } from './onramp-provider-layout';
interface OnrampProvidersProps {
  address: string;
}

export const OnrampProviders = (props: OnrampProvidersProps) => {
  const { address } = props;
  const activeProviders = useActiveFiatProviders();
  const hasProviders = useHasFiatProviders();
  if (!hasProviders) return null;

  const providersUrl = {
    moonpay: makeMoonPayUrl(address),
    okcoin: makeOkcoinUrl(address),
    transak: makeTransakUrl(address),
  };

  return (
    <>
      {Object.keys(activeProviders).map(provider => (
        <OnrampProviderLayout
          key={provider}
          provider={provider}
          providerUrl={providersUrl[provider as keyof ProvidersUrl]}
        />
      ))}
    </>
  );
};
