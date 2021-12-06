const isProduction = process.env.WALLET_ENVIRONMENT === 'production';

const subdomain = isProduction ? 'www' : 'beta';

export function makeOkcoinUrl(address: string) {
  return `https://${subdomain}.okcoin.org/bridgeBeta/thirdBridge?isThirdBridge=1&partnerId=10002&crypto=STX&address=w${address}&thirdPartyName=Hiro&fiatAmount=100&currency=USD`;
}
