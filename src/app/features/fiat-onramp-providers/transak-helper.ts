import { TRANSAK_API_KEY_PRODUCTION, TRANSAK_API_KEY_STAGING } from '@shared/constants';

const isProduction =
  process.env.WALLET_ENVIRONMENT === 'production' || process.env.WALLET_ENVIRONMENT === 'preview';

const transakApiKey = isProduction ? TRANSAK_API_KEY_PRODUCTION : TRANSAK_API_KEY_STAGING;
const subdomain = isProduction ? 'global' : 'staging-global';
const screenTitle = 'Buy Stacks';

export function makeTransakUrl(address: string) {
  return `https://${subdomain}.transak.com?apiKey=${transakApiKey}&cryptoCurrencyCode=STX&exchangeScreenTitle=${encodeURI(
    screenTitle
  )}&defaultPaymentMethod=credit_debit_card&walletAddress=${address}`;
}
