import { bytesToHex, intToBigInt } from '@stacks/common';
import { randomBytes } from '@stacks/encryption';

import { useSwapActions } from '@app/common/swaps';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { getMagicContracts } from '../client';
import { fetchSuppliers } from '../fetch';
import { MagicFetchContextWithBitcoin } from '../fetch/constants';
import { MagicSupplier } from '../models';
import { convertBtcToSats } from '../utils';
import { useMagicClient } from './use-magic-client.hooks';

export function useInboundMagicSwap() {
  const { createInboundMagicSwap } = useSwapActions();
  const account = useCurrentStacksAccount();
  const network = useCurrentNetworkState();

  const magicClient = useMagicClient();
  const bitcoinClient = useBitcoinClient();

  const magicContracts = getMagicContracts(network.id);

  const fetchContext = {
    network: network.id,
    bitcoinClient,
    magicContracts,
    magicClient,
  };

  async function createInboundSwap(btcAmount: number) {
    const suppliers = await fetchSuppliers(fetchContext);

    const bestSupplier = await getBestSupplier(btcAmount, false, fetchContext);
    const supplier = suppliers.find(s => s.id === bestSupplier.id);

    if (!account || !supplier) {
      throw new Error('Invalid user state.');
    }

    const secret = randomBytes(32);
    const publicKey = account.dataPublicKey;
    const expiration = 10;

    const createdAt = new Date().getTime();

    const swap = createInboundMagicSwap({
      id: createdAt.toString(),
      secret: bytesToHex(secret),
      amount: convertBtcToSats(btcAmount).toString(),
      address: account.address,
      expiration,
      createdAt,
      publicKey,
      supplier,
    }).payload;

    // const hash = sha256(hexToBytes(swap.secret));

    // const payment = generateHTLCAddress(
    //   {
    //     senderPublicKey: Buffer.from(publicKey, 'hex'),
    //     recipientPublicKey: Buffer.from(supplier.publicKey, 'hex'),
    //     swapper: swapperId,
    //     hash: Buffer.from(hash),
    //     expiration: swap.expiration,
    //   },
    //   bitcoinNetwork
    // );

    return swap;
  }

  return {
    createInboundSwap,
  };
}

function getSwapFees(supplier: MagicSupplier, isOutbound: boolean) {
  const baseFee = isOutbound ? supplier.outboundBaseFee : supplier.inboundBaseFee;
  const feeRate = isOutbound ? supplier.outboundFee : supplier.inboundFee;

  return {
    baseFee,
    feeRate,
  };
}

async function getSuppliers(isOutbound: boolean, context: MagicFetchContextWithBitcoin) {
  const suppliers = await fetchSuppliers(context);

  return suppliers
    .map(supplier => {
      const { baseFee, feeRate } = getSwapFees(supplier, isOutbound);
      const capacity = isOutbound ? supplier.btc : supplier.funds;

      return {
        baseFee,
        feeRate,
        capacity: BigInt(capacity),
        id: supplier.id,
        controller: supplier.controller,
      };
    })
    .sort(supplier => -supplier.baseFee);
}

function getSwapAmount(amount: bigint, feeRate: number, baseFee: number | null) {
  const withBps = (amount * (10000n - intToBigInt(feeRate, true))) / 10000n;

  if (baseFee !== null) {
    return withBps - BigInt(baseFee);
  }

  return withBps;
}

async function getBestSupplier(
  btcAmount: number,
  isOutbound: boolean,
  context: MagicFetchContextWithBitcoin
) {
  const suppliers = await getSuppliers(isOutbound, context);
  const [defaultSupplier] = suppliers;

  const satsAmount = convertBtcToSats(btcAmount);
  const suppliersWithCapacity = suppliers.filter(op => satsAmount < op.capacity);

  if (suppliersWithCapacity.length === 0) {
    return defaultSupplier;
  }

  const sortedFee = suppliersWithCapacity.sort((left, right) => {
    const leftAmount = getSwapAmount(satsAmount, left.feeRate, left.baseFee);
    const rightAmount = getSwapAmount(satsAmount, right.feeRate, right.baseFee);

    if (leftAmount > rightAmount) {
      return -1;
    } else if (leftAmount < rightAmount) {
      return 1;
    } else {
      return 0;
    }
  });

  return sortedFee[0];
}
