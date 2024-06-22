import type { IManageTokens } from "@app/store/manage-tokens/manage-tokens.slice";
import type { Sip10CryptoAssetFilter, SwapAsset } from "@leather.io/query";
import { getPrincipalFromContractId } from "@leather.io/utils";

export type AssetFilter = 'all' | 'enabled' | 'disabled';

export const defaultEnabledTokens = new Set([
  'bitcoin',
  'stacks',
  'DOG•GO•TO•THE•MOON',
  'SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token::welshcorgicoin',
  'SP1AY6K3PQV5MRT6R4S671NWW2FRVPKM0BR162CT6.leo-token::leo',
  'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27.miamicoin-token::miamicoin',
  'SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc::aeusdc',
  'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-abtc::bridged-btc',
  'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt::bridged-usdt',
  'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-alex::alex',
  'SM26NBC8SFHNW4P1Y4DFH27974P56WN86C92HPEHH.token-lqstx::lqstx',
  'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.velar-token::velar',
  'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token::ststx',
  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-token::diko',
]);

export function filterTokens<T>({
  tokens,
  accountIndex,
  allTokens,
  filter = 'all',
  getTokenIdentifier,
}: {
  tokens: T[];
  accountIndex: number;
  allTokens: IManageTokens[];
  filter: AssetFilter | Sip10CryptoAssetFilter;
  getTokenIdentifier(token: T): string;
}): T[] {
  if (filter === 'all') return tokens;
  if (!getTokenIdentifier) throw new Error('Token identifier is missing');
  
  return tokens.filter(token => {
    const tokenIdentifier = getTokenIdentifier(token);
    switch (filter) {
      case 'supported':
      case 'enabled':
        return isTokenEnabled({ tokenIdentifier, allTokens, accountIndex });
      case 'disabled':
      case 'unsupported':
        return !isTokenEnabled({ tokenIdentifier, allTokens, accountIndex });
    }
  });
}

export function isTokenEnabled({
  allTokens,
  accountIndex,
  tokenIdentifier,
}: {
  allTokens: IManageTokens[];
  accountIndex: number;
  tokenIdentifier: string;
}) {
  const tokenSetByUser = allTokens.find(
    t => t.accountIndex === accountIndex && t.id === tokenIdentifier
  );
  const isEnabledByDefault = defaultEnabledTokens.has(tokenIdentifier);
  return tokenSetByUser?.enabled ?? isEnabledByDefault;
}

export function sortTokensBySwappability<T>({tokens, swapAssets, getTokenIdentifier}:{
  tokens: T[];
  swapAssets: SwapAsset[];
  getTokenIdentifier(token: T): string
}):T[] {
  return tokens.sort((a, b) => {
    const aPrincipal = getPrincipalFromContractId(getTokenIdentifier(a));
    const bPrincipal = getPrincipalFromContractId(getTokenIdentifier(b));
    return (
      Number(swapAssets.some(swapAsset => swapAsset.principal === bPrincipal)) -
      Number(swapAssets.some(swapAsset => swapAsset.principal === aPrincipal))
    );
  });
};
