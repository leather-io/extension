# Leather Wallet dApp Integration Guide

A comprehensive guide for integrating Leather wallet into your Stacks and Bitcoin dApps.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Connecting to Wallet](#connecting-to-wallet)
3. [Stacks Transactions](#stacks-transactions)
4. [Bitcoin Transactions](#bitcoin-transactions)
5. [Message Signing](#message-signing)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### Installation

```bash
npm install @stacks/connect
```

### Basic Setup

```typescript
import { AppConfig, UserSession } from '@stacks/connect';

// Configure your app
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

// Check if user is signed in
function isUserSignedIn(): boolean {
  return userSession.isUserSignedIn();
}

// Get user data
function getUserData() {
  if (isUserSignedIn()) {
    return userSession.loadUserData();
  }
  return null;
}
```

## Connecting to Wallet

### Authentication Flow

```typescript
import { showConnect } from '@stacks/connect';

interface ConnectOptions {
  appDetails: {
    name: string;
    icon: string;
  };
  onFinish: (payload: { userSession: UserSession }) => void;
  onCancel: () => void;
}

function connectWallet() {
  showConnect({
    appDetails: {
      name: 'My Awesome dApp',
      icon: 'https://example.com/icon.png'
    },
    onFinish: (payload) => {
      const userData = payload.userSession.loadUserData();
      console.log('Connected address:', userData.profile.stxAddress.mainnet);
      
      // Store session or update UI
      handleSuccessfulConnection(userData);
    },
    onCancel: () => {
      console.log('User cancelled connection');
    }
  });
}

function handleSuccessfulConnection(userData: any) {
  // Update your app state
  const addresses = {
    stacks: {
      mainnet: userData.profile.stxAddress.mainnet,
      testnet: userData.profile.stxAddress.testnet
    },
    bitcoin: {
      mainnet: userData.profile.btcAddress?.p2wpkh?.mainnet,
      testnet: userData.profile.btcAddress?.p2wpkh?.testnet
    }
  };
  
  console.log('User addresses:', addresses);
}
```

### React Hook Example

```typescript
import { useState, useCallback, useEffect } from 'react';
import { showConnect, UserSession, AppConfig } from '@stacks/connect';

interface UseWalletReturn {
  isConnected: boolean;
  address: string | null;
  connect: () => void;
  disconnect: () => void;
}

const appConfig = new AppConfig(['store_write']);
const userSession = new UserSession({ appConfig });

export function useWallet(): UseWalletReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setAddress(userData.profile.stxAddress.mainnet);
      setIsConnected(true);
    }
  }, []);

  const connect = useCallback(() => {
    showConnect({
      appDetails: {
        name: 'My dApp',
        icon: window.location.origin + '/icon.png'
      },
      onFinish: () => {
        const userData = userSession.loadUserData();
        setAddress(userData.profile.stxAddress.mainnet);
        setIsConnected(true);
      },
      onCancel: () => {}
    });
  }, []);

  const disconnect = useCallback(() => {
    userSession.signUserOut();
    setAddress(null);
    setIsConnected(false);
  }, []);

  return { isConnected, address, connect, disconnect };
}
```

## Stacks Transactions

### Contract Call

```typescript
import { openContractCall, FinishedTxData } from '@stacks/connect';
import { 
  uintCV, 
  stringAsciiCV, 
  standardPrincipalCV,
  PostConditionMode,
  makeStandardSTXPostCondition,
  FungibleConditionCode
} from '@stacks/transactions';

interface ContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  onSuccess?: (data: FinishedTxData) => void;
  onCancel?: () => void;
}

async function callContract(options: ContractCallOptions) {
  openContractCall({
    network: 'mainnet',
    contractAddress: options.contractAddress,
    contractName: options.contractName,
    functionName: options.functionName,
    functionArgs: options.functionArgs,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    onFinish: (data) => {
      console.log('Transaction ID:', data.txId);
      console.log('Transaction:', data.txRaw);
      options.onSuccess?.(data);
    },
    onCancel: () => {
      console.log('Transaction cancelled');
      options.onCancel?.();
    }
  });
}

// Example: Voting contract call
function castVote(pollId: number, optionId: number) {
  callContract({
    contractAddress: 'SP...',
    contractName: 'voting',
    functionName: 'vote',
    functionArgs: [uintCV(pollId), uintCV(optionId)],
    onSuccess: (data) => {
      alert(`Vote submitted! TX: ${data.txId}`);
    }
  });
}
```

### STX Transfer

```typescript
import { openSTXTransfer } from '@stacks/connect';

function sendSTX(recipient: string, amountMicroSTX: number, memo?: string) {
  openSTXTransfer({
    network: 'mainnet',
    recipient,
    amount: amountMicroSTX.toString(),
    memo: memo || '',
    onFinish: (data) => {
      console.log('Transfer TX:', data.txId);
    },
    onCancel: () => {
      console.log('Transfer cancelled');
    }
  });
}

// Send 10 STX
sendSTX('SP...RECIPIENT', 10_000_000, 'Payment for services');
```

### Contract Deployment

```typescript
import { openContractDeploy } from '@stacks/connect';

function deployContract(contractName: string, clarityCode: string) {
  openContractDeploy({
    network: 'mainnet',
    contractName,
    codeBody: clarityCode,
    onFinish: (data) => {
      console.log('Contract deployed! TX:', data.txId);
    },
    onCancel: () => {
      console.log('Deployment cancelled');
    }
  });
}
```

## Bitcoin Transactions

### Send Bitcoin

```typescript
import { openPsbtRequestPopup, SignedPsbt } from '@stacks/connect';

interface BitcoinSendOptions {
  recipient: string;
  amountSats: number;
}

async function sendBitcoin(options: BitcoinSendOptions) {
  // Build the PSBT (Partially Signed Bitcoin Transaction)
  const psbtHex = await buildPsbt(options);

  openPsbtRequestPopup({
    network: 'mainnet',
    hex: psbtHex,
    allowedSighashTypes: [0x01], // SIGHASH_ALL
    signAtIndex: [0],
    onFinish: (data: SignedPsbt) => {
      console.log('Signed PSBT:', data.hex);
      // Broadcast the transaction
      broadcastBitcoinTx(data.hex);
    },
    onCancel: () => {
      console.log('Bitcoin transaction cancelled');
    }
  });
}
```

### Sign PSBT

```typescript
import { openPsbtRequestPopup } from '@stacks/connect';

async function signPsbt(psbtHex: string, inputsToSign: number[]) {
  return new Promise<string>((resolve, reject) => {
    openPsbtRequestPopup({
      network: 'mainnet',
      hex: psbtHex,
      signAtIndex: inputsToSign,
      onFinish: (data) => {
        resolve(data.hex);
      },
      onCancel: () => {
        reject(new Error('User cancelled'));
      }
    });
  });
}
```

## Message Signing

### Sign Stacks Message

```typescript
import { openSignatureRequestPopup } from '@stacks/connect';

function signMessage(message: string): Promise<{ signature: string; publicKey: string }> {
  return new Promise((resolve, reject) => {
    openSignatureRequestPopup({
      message,
      network: 'mainnet',
      onFinish: (data) => {
        resolve({
          signature: data.signature,
          publicKey: data.publicKey
        });
      },
      onCancel: () => {
        reject(new Error('User cancelled signing'));
      }
    });
  });
}

// Example: Sign login message
async function authenticateWithSignature() {
  const nonce = generateNonce();
  const message = `Sign in to MyApp\nNonce: ${nonce}`;
  
  try {
    const { signature, publicKey } = await signMessage(message);
    
    // Verify signature on your backend
    const response = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ message, signature, publicKey, nonce })
    });
    
    return response.json();
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}
```

### Structured Data Signing

```typescript
import { openStructuredDataSignatureRequestPopup } from '@stacks/connect';
import { tupleCV, stringAsciiCV, uintCV } from '@stacks/transactions';

function signStructuredData() {
  const domain = tupleCV({
    name: stringAsciiCV('MyApp'),
    version: stringAsciiCV('1.0.0'),
    'chain-id': uintCV(1) // mainnet
  });

  const message = tupleCV({
    action: stringAsciiCV('approve'),
    amount: uintCV(1000000),
    recipient: stringAsciiCV('SP...')
  });

  openStructuredDataSignatureRequestPopup({
    domain,
    message,
    network: 'mainnet',
    onFinish: (data) => {
      console.log('Structured signature:', data.signature);
    },
    onCancel: () => {
      console.log('Cancelled');
    }
  });
}
```

## Best Practices

### 1. Always Use Post-Conditions

```typescript
import {
  makeStandardSTXPostCondition,
  makeStandardFungiblePostCondition,
  FungibleConditionCode,
  PostConditionMode
} from '@stacks/transactions';

// Protect users from unexpected fund transfers
function createSafeContractCall(
  userAddress: string,
  maxSTXAmount: number
) {
  const postConditions = [
    // User will not send more than maxSTXAmount
    makeStandardSTXPostCondition(
      userAddress,
      FungibleConditionCode.LessEqual,
      maxSTXAmount
    )
  ];

  return {
    postConditions,
    postConditionMode: PostConditionMode.Deny
  };
}
```

### 2. Handle Network Switching

```typescript
function getNetworkFromAddress(address: string): 'mainnet' | 'testnet' {
  if (address.startsWith('SP')) return 'mainnet';
  if (address.startsWith('ST')) return 'testnet';
  throw new Error('Invalid Stacks address');
}

function validateNetworkMatch(
  userAddress: string,
  contractAddress: string
): boolean {
  const userNetwork = getNetworkFromAddress(userAddress);
  const contractNetwork = getNetworkFromAddress(contractAddress);
  return userNetwork === contractNetwork;
}
```

### 3. Implement Proper Error Handling

```typescript
import { ContractCallError, AuthError } from '@stacks/connect';

async function safeContractCall(options: ContractCallOptions) {
  try {
    await callContract(options);
  } catch (error) {
    if (error instanceof ContractCallError) {
      // Handle contract-specific errors
      console.error('Contract error:', error.message);
    } else if (error instanceof AuthError) {
      // Handle authentication errors
      console.error('Auth error - reconnect wallet');
      connectWallet();
    } else {
      // Handle other errors
      console.error('Unknown error:', error);
    }
  }
}
```

### 4. Display Transaction Status

```typescript
async function waitForTransaction(txId: string): Promise<any> {
  const apiUrl = 'https://api.mainnet.hiro.so/extended/v1';
  const maxAttempts = 60;
  
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`${apiUrl}/tx/${txId}`);
    const data = await response.json();
    
    if (data.tx_status === 'success') {
      return { status: 'success', data };
    }
    
    if (data.tx_status === 'abort_by_response' || 
        data.tx_status === 'abort_by_post_condition') {
      return { status: 'failed', data };
    }
    
    // Wait 10 seconds before checking again
    await new Promise(r => setTimeout(r, 10000));
  }
  
  throw new Error('Transaction timeout');
}
```

## Troubleshooting

### Common Issues

#### Wallet Not Detected

```typescript
function isWalletInstalled(): boolean {
  return typeof window !== 'undefined' && 
         typeof (window as any).LeatherProvider !== 'undefined';
}

function promptInstall() {
  if (!isWalletInstalled()) {
    window.open('https://leather.io/install-extension', '_blank');
  }
}
```

#### Transaction Pending Too Long

```typescript
async function checkTransactionStatus(txId: string) {
  const response = await fetch(
    `https://api.mainnet.hiro.so/extended/v1/tx/${txId}`
  );
  const tx = await response.json();
  
  if (tx.tx_status === 'pending') {
    // Check if it's been pending for too long
    const pendingTime = Date.now() - new Date(tx.receipt_time_iso).getTime();
    
    if (pendingTime > 30 * 60 * 1000) { // 30 minutes
      console.warn('Transaction has been pending for a long time');
      // Suggest RBF or wait
    }
  }
  
  return tx;
}
```

#### Wrong Network

```typescript
function ensureCorrectNetwork(
  expectedNetwork: 'mainnet' | 'testnet'
) {
  const userData = userSession.loadUserData();
  const userAddress = expectedNetwork === 'mainnet' 
    ? userData.profile.stxAddress.mainnet 
    : userData.profile.stxAddress.testnet;
  
  if (!userAddress) {
    throw new Error(`No address available for ${expectedNetwork}`);
  }
  
  return userAddress;
}
```

## Additional Resources

- [Leather Documentation](https://leather.io/docs)
- [Stacks Connect Reference](https://connect.stacks.js.org/)
- [Stacks.js Documentation](https://stacks.js.org/)

---

*This guide is maintained by the community. Contributions welcome!*
