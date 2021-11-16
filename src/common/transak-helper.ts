import { ENVIRONMENT } from '@common/environment-helper';
import { TRANSAK_API_KEY_PRODUCTION, TRANSAK_API_KEY_STAGING } from '@common/constants';

const IS_PRODUCTION = ENVIRONMENT === 'production';

const TRANSAK_API_KEY = IS_PRODUCTION ? TRANSAK_API_KEY_PRODUCTION : TRANSAK_API_KEY_STAGING;
const SUBDOMAIN = IS_PRODUCTION ? 'global' : 'staging-global';
const SCREEN_TITLE = 'Buy Stacks';

export function transakUrl(address: string | undefined) {
  return `https://${SUBDOMAIN}.transak.com?apiKey=${TRANSAK_API_KEY}&cryptoCurrencyCode=STX&exchangeScreenTitle=${SCREEN_TITLE}&defaultPaymentMethod=credit_debit_card&walletAddress=${address}`;
}
