import { UserSession, AppConfig } from 'blockstack';
import { SECP256K1Client, TokenSigner } from 'jsontokens';
import { defaultAuthURL } from '../auth';
import { popupCenter } from '../popup';

export interface ContractCallOptions {
  contractAddress: string;
  functionName: string;
  contractName: string;
  functionArgs?: any[];
  authOrigin?: string;
  userSession?: UserSession;
}

export const makeContractCallToken = async (opts: ContractCallOptions) => {
  const { contractAddress, functionName, contractName, functionArgs } = opts;
  let { userSession } = opts;
  if (!userSession) {
    const appConfig = new AppConfig(['store_write'], document.location.href);
    // eslint-disable-next-line no-param-reassign
    userSession = new UserSession({ appConfig });
  }
  const privateKey = userSession.loadUserData().appPrivateKey;
  const publicKey = SECP256K1Client.derivePublicKey(privateKey);

  const payload = {
    contractAddress,
    contractName,
    functionName,
    functionArgs: functionArgs || [],
    publicKey,
  };

  const tokenSigner = new TokenSigner('ES256k', privateKey);
  const token = await tokenSigner.signAsync(payload);
  return token;
};

export const openContractCall = async (opts: ContractCallOptions) => {
  const token = await makeContractCallToken(opts);
  const extensionURL = await window.BlockstackProvider?.getURL();
  const authURL = new URL(extensionURL || opts.authOrigin || defaultAuthURL);
  const urlParams = new URLSearchParams();
  urlParams.set('request', token);
  const popup = popupCenter({
    url: `${authURL.origin}/#/transaction?${urlParams.toString()}`,
  });
  return popup;
};
