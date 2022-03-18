import { MOONPAY_API_KEY_PRODUCTION } from '@shared/constants';

export function makeMoonPayUrl(address: string) {
  return `https://buy.moonpay.com?apiKey=${MOONPAY_API_KEY_PRODUCTION}&currencyCode=stx&walletAddress=${address}`;
}
