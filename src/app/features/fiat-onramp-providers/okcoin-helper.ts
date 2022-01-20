export function makeOkcoinUrl(address: string) {
  const successBackLink = encodeURI(`https://explorer.stacks.co/address/${address}?chain=mainnet`);
  const thirdPartyLink = encodeURI('https://hiro.so');
  return `https://www.okcoin.com/bridge/thirdBridge?isThirdBridge=1&partnerId=10002&crypto=STX&address=${address}&thirdPartyName=Hiro&fiatAmount=100&currency=USD&successBackLink=${successBackLink}&thirdPartyLink=${thirdPartyLink}`;
}
