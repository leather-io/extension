import { bip32, ECPair } from 'bitcoinjs-lib';
import { getPublicKeyFromPrivate } from 'blockstack/lib/keys';
import { makeAuthResponse } from 'blockstack/lib/auth/authMessages';

import { IdentityKeyPair } from './utils/index';
import {
  makeGaiaAssociationToken,
  DEFAULT_GAIA_HUB,
  getHubInfo,
  connectToGaiaHubWithConfig,
} from './utils/gaia';
import IdentityAddressOwnerNode from './nodes/identity-address-owner-node';
import { Profile, fetchProfile, DEFAULT_PROFILE, signAndUploadProfile } from './profiles';
import { ecPairToAddress } from 'blockstack';
import {
  makeContractCall,
  makeSmartContractDeploy,
  TransactionVersion,
  AddressVersion,
  AddressHashMode,
  ClarityValue,
  pubKeyfromPrivKey,
  addressFromPublicKeys,
  addressToString,
  StacksTestnet,
} from '@blockstack/stacks-transactions';
import BN from 'bn.js';
import RPCClient from '@blockstack/rpc-client';

interface IdentityConstructorOptions {
  keyPair: IdentityKeyPair;
  address: string;
  usernames?: string[];
  defaultUsername?: string;
  profile?: Profile;
  nonce: number;
}

interface RefreshOptions {
  gaiaUrl: string;
}

interface ContractCallOptions {
  contractName: string;
  contractAddress: string;
  functionName: string;
  functionArgs: ClarityValue[];
  version: TransactionVersion;
  nonce: number;
}

interface ContractDeployOptions {
  contractName: string;
  contractSource: string;
  version: TransactionVersion;
  nonce: number;
}

export class Identity {
  public keyPair: IdentityKeyPair;
  public address: string;
  public defaultUsername?: string;
  public usernames: string[];
  public profile?: Profile;
  public nonce: number;

  constructor({
    keyPair,
    address,
    usernames,
    defaultUsername,
    profile,
    nonce,
  }: IdentityConstructorOptions) {
    this.keyPair = keyPair;
    this.address = address;
    this.usernames = usernames || [];
    this.defaultUsername = defaultUsername;
    this.profile = profile;
    this.nonce = 0 || nonce;
  }

  async makeAuthResponse({
    appDomain,
    gaiaUrl,
    transitPublicKey,
    scopes = [],
  }: {
    appDomain: string;
    gaiaUrl: string;
    transitPublicKey: string;
    scopes?: string[];
  }) {
    const appPrivateKey = this.appPrivateKey(appDomain);
    const hubInfo = await getHubInfo(gaiaUrl);
    const profileUrl = await this.profileUrl(hubInfo.read_url_prefix);
    const profile =
      (await fetchProfile({ identity: this, gaiaUrl: hubInfo.read_url_prefix })) || DEFAULT_PROFILE;
    if (scopes.includes('publish_data')) {
      if (!profile.apps) {
        profile.apps = {};
      }
      const challengeSigner = ECPair.fromPrivateKey(Buffer.from(appPrivateKey, 'hex'));
      const storageUrl = `${hubInfo.read_url_prefix}${ecPairToAddress(challengeSigner)}/`;
      profile.apps[appDomain] = storageUrl;
      if (!profile.appsMeta) {
        profile.appsMeta = {};
      }
      profile.appsMeta[appDomain] = {
        storage: storageUrl,
        publicKey: challengeSigner.publicKey.toString('hex'),
      };
      const gaiaHubConfig = connectToGaiaHubWithConfig({
        hubInfo,
        privateKey: this.keyPair.key,
        gaiaHubUrl: gaiaUrl,
      });
      await signAndUploadProfile({ profile, identity: this, gaiaHubUrl: gaiaUrl, gaiaHubConfig });
    }
    this.profile = profile;

    const compressedAppPublicKey = getPublicKeyFromPrivate(appPrivateKey.slice(0, 64));
    const associationToken = makeGaiaAssociationToken(this.keyPair.key, compressedAppPublicKey);

    return makeAuthResponse(
      this.keyPair.key,
      {
        ...(this.profile || {}),
        stxAddress: addressToString(this.getSTXAddress(AddressVersion.TestnetSingleSig)),
      },
      this.defaultUsername || '',
      {
        profileUrl,
      },
      undefined,
      appPrivateKey,
      undefined,
      transitPublicKey,
      gaiaUrl,
      undefined,
      associationToken
    );
  }

  appPrivateKey(appDomain: string) {
    const { salt, appsNodeKey } = this.keyPair;
    const appsNode = new IdentityAddressOwnerNode(bip32.fromBase58(appsNodeKey), salt);
    return appsNode.getAppPrivateKey(appDomain);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async profileUrl(gaiaUrl: string) {
    // future proofing for code that may require network requests to find profile
    return `${gaiaUrl}${this.address}/profile.json`;
  }

  async fetchNames() {
    const getNamesUrl = `https://core.blockstack.org/v1/addresses/bitcoin/${this.address}`;
    const res = await fetch(getNamesUrl);
    const data = await res.json();
    const { names }: { names: string[] } = data;
    return names;
  }

  /**
   * Fetch existing information related to this identity, like username and profile information
   */
  async refresh(opts: RefreshOptions = { gaiaUrl: DEFAULT_GAIA_HUB }) {
    try {
      const [names, profile] = await Promise.all([
        this.fetchNames(),
        fetchProfile({ identity: this, gaiaUrl: opts.gaiaUrl }),
      ]);
      if (names) {
        if (names[0] && !this.defaultUsername) {
          this.defaultUsername = names[0];
        }
        names.forEach(name => {
          const existingIndex = this.usernames.findIndex(u => u === name);
          if (existingIndex === -1) {
            this.usernames.push(name);
          }
        });
      }
      if (profile) {
        this.profile = profile;
      }
      return;
    } catch (error) {
      return;
    }
  }

  getSTXNode() {
    const { stxNodeKey } = this.keyPair;
    const node = bip32.fromBase58(stxNodeKey);
    return node;
  }

  getSTXPrivateKey() {
    const { stxNodeKey } = this.keyPair;
    const node = bip32.fromBase58(stxNodeKey);
    if (!node.privateKey) {
      throw new Error(`Unable to get STX private key for identity ${this.address}`);
    }
    return node.privateKey;
  }

  getSTXAddress(version: AddressVersion) {
    const pk = pubKeyfromPrivKey(this.getSTXPrivateKey().toString('hex'));
    const address = addressFromPublicKeys(version, AddressHashMode.SerializeP2PKH, 1, [pk]);
    return address;
  }

  async fetchAccount({ version, rpcClient }: { version: AddressVersion; rpcClient: RPCClient }) {
    const address = this.getSTXAddress(version);
    const account = await rpcClient.fetchAccount(addressToString(address));
    return account;
  }

  signContractCall({
    contractName,
    contractAddress,
    functionName,
    functionArgs,
    nonce,
  }: ContractCallOptions) {
    const tx = makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      senderKey: this.getSTXPrivateKey().toString('hex'),
      fee: new BN(200),
      nonce: new BN(nonce),
      network: new StacksTestnet(),
    });
    return tx;
  }

  signContractDeploy({ contractName, contractSource, nonce }: ContractDeployOptions) {
    const tx = makeSmartContractDeploy({
      contractName,
      codeBody: contractSource,
      fee: new BN(2000),
      senderKey: this.getSTXPrivateKey().toString('hex'),
      network: new StacksTestnet(),
      nonce: new BN(nonce),
    });
    return tx;
  }
}

export default Identity;
