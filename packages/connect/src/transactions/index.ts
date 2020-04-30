import { UserSession, AppConfig } from 'blockstack';
import { SECP256K1Client, TokenSigner } from 'jsontokens';
import { defaultAuthURL, AuthOptions } from '../auth';
import { popupCenter, setupListener } from '../popup';

interface TxBase {
  appDetails?: AuthOptions['appDetails'];
}

export interface FinishedTxData {
  txId: string;
  txRaw: string;
}

interface ContractCallBase extends TxBase {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ContractCallArgument[];
}

export interface ContractCallOptions extends ContractCallBase {
  authOrigin?: string;
  userSession?: UserSession;
  finished?: (data: FinishedTxData) => void;
}

export enum ContractCallArgumentType {
  BUFFER = 'buffer',
  UINT = 'uint',
  INT = 'int',
  PRINCIPAL = 'principal',
  BOOL = 'bool',
}

export interface ContractCallArgument {
  type: ContractCallArgumentType;
  value: string;
}

export interface ContractCallPayload extends ContractCallBase {
  txType: 'contract-call';
  publicKey: string;
}

const makeKeys = (userSession: UserSession | undefined) => {
  if (!userSession) {
    const appConfig = new AppConfig(['store_write'], document.location.href);
    // eslint-disable-next-line no-param-reassign
    userSession = new UserSession({ appConfig });
  }
  const privateKey = userSession.loadUserData().appPrivateKey;
  const publicKey = SECP256K1Client.derivePublicKey(privateKey);
  return { privateKey, publicKey };
};

const signPayload = async (payload: ContractCallPayload | ContractDeployPayload, privateKey: string) => {
  const tokenSigner = new TokenSigner('ES256k', privateKey);
  const token = await tokenSigner.signAsync(payload as any);
  return token;
};

export const makeContractCallToken = async (opts: ContractCallOptions) => {
  const { contractAddress, functionName, contractName, functionArgs, appDetails } = opts;
  const { privateKey, publicKey } = makeKeys(opts.userSession);

  const payload: ContractCallPayload = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    txType: 'contract-call',
    publicKey,
  };

  if (appDetails) {
    payload.appDetails = appDetails;
  }

  return signPayload(payload, privateKey);
};

const openTransactionPopup = async ({
  token,
  opts,
}: {
  token: string;
  opts: ContractCallOptions | ContractDeployOptions;
}) => {
  const extensionURL = await window.BlockstackProvider?.getURL();
  const authURL = new URL(extensionURL || opts.authOrigin || defaultAuthURL);
  const urlParams = new URLSearchParams();
  urlParams.set('request', token);
  const popup = popupCenter({
    url: `${authURL.origin}/#/transaction?${urlParams.toString()}`,
  });

  setupListener<FinishedTxData>({
    popup,
    authURL,
    finished: data => {
      if (opts.finished) {
        opts.finished(data);
      }
    },
    messageParams: {},
  });
  return popup;
};

export const openContractCall = async (opts: ContractCallOptions) => {
  const token = await makeContractCallToken(opts);
  return openTransactionPopup({ token, opts });
};

interface ContractDeployBase extends TxBase {
  contractName: string;
  source: string;
}

export interface ContractDeployOptions extends ContractDeployBase {
  authOrigin?: string;
  userSession?: UserSession;
  finished?: (data: FinishedTxData) => void;
}

interface ContractDeployPayload extends ContractDeployOptions {
  publicKey: string;
  txType: 'contract-deploy';
}

export const makeContractDeployToken = async (opts: ContractDeployOptions) => {
  const { contractName, source, appDetails } = opts;
  const { privateKey, publicKey } = makeKeys(opts.userSession);

  const payload: ContractDeployPayload = {
    contractName,
    source,
    txType: 'contract-deploy',
    publicKey,
  };

  if (appDetails) {
    payload.appDetails = appDetails;
  }

  return signPayload(payload, privateKey);
};

export const openContractDeploy = async (opts: ContractDeployOptions) => {
  const token = await makeContractDeployToken(opts);
  return openTransactionPopup({ token, opts });
};
