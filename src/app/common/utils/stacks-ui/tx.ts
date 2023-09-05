/* eslint-disable */
// taken from ui-core './tx.esm.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// FIXME - refactor this function to use TS + pass esLint
import { truncateMiddle } from './strings.ts';
import { toHumanReadableStx } from './units.ts';

var _txTypeNamesMap;
var getContractName = function getContractName(value) {
  if (value.includes('.')) {
    var parts = value == null ? void 0 : value.split('.');

    if (value.includes('::')) {
      return parts[1].split('::')[0];
    }

    return parts[1];
  }

  console.warn('getContractName: does not contain a period, does not appear to be a contract_id.', {
    value: value,
  });
  return value;
};
var getAssetName = function getAssetName(fullyQualifiedName) {
  if (!fullyQualifiedName.includes('::')) {
    console.warn(
      'getAssetName: does not contain "::", does not appear to be a fully qualified name of an asset.',
      {
        fullyQualifiedName: fullyQualifiedName,
      }
    );
    return fullyQualifiedName;
  }

  return fullyQualifiedName.split('::')[1];
};
var getAssetStringParts = function getAssetStringParts(fullyQualifiedName) {
  if (!fullyQualifiedName.includes('.') || !fullyQualifiedName.includes('::')) {
    console.warn(
      'getAssetStringParts: does not contain a period or "::", does not appear to be a fully qualified name of an asset.',
      {
        fullyQualifiedName: fullyQualifiedName,
      }
    );
    return {
      address: fullyQualifiedName,
      contractName: fullyQualifiedName,
      assetName: fullyQualifiedName,
    };
  }

  var address = fullyQualifiedName.split('.')[0];
  var contractName = getContractName(fullyQualifiedName);
  var assetName = getAssetName(fullyQualifiedName);
  return {
    address: address,
    contractName: contractName,
    assetName: assetName,
  };
};
var TransactionType = {
  SMART_CONTRACT: 'smart_contract',
  CONTRACT_CALL: 'contract_call',
  TOKEN_TRANSFER: 'token_transfer',
  COINBASE: 'coinbase',
  POISON_MICROBLOCK: 'poison_microblock',
};
function hasMemo(tx) {
  if (tx.tx_type !== 'token_transfer') return false;
  return !!tx.token_transfer.memo;
}
function getRecipientAddress(tx) {
  if (tx.tx_type !== 'token_transfer') return null;
  return tx.token_transfer.recipient_address;
}
function getFunctionName(tx) {
  if (tx.tx_type !== 'contract_call') return null;
  return tx.contract_call.function_name;
}
function isPendingTx(tx) {
  return tx.tx_status === 'pending';
}
var getTxTitle = function getTxTitle(transaction) {
  var _transaction$smart_co;

  switch (transaction.tx_type) {
    case 'smart_contract':
      return getContractName(
        transaction == null
          ? void 0
          : (_transaction$smart_co = transaction.smart_contract) == null
          ? void 0
          : _transaction$smart_co.contract_id
      );

    case 'contract_call':
      return getFunctionName(transaction);

    case 'token_transfer':
      return toHumanReadableStx(transaction.token_transfer.amount);

    case 'coinbase':
      return 'Block #' + transaction.block_height + ' coinbase';

    default:
      return truncateMiddle(transaction.tx_id, 10);
  }
};
var txTypeNamesMap =
  ((_txTypeNamesMap = {}),
  (_txTypeNamesMap[TransactionType.SMART_CONTRACT] = 'Contract deploy'),
  (_txTypeNamesMap[TransactionType.CONTRACT_CALL] = 'Function call'),
  (_txTypeNamesMap[TransactionType.TOKEN_TRANSFER] = 'Token transfer'),
  (_txTypeNamesMap[TransactionType.COINBASE] = 'Coinbase'),
  (_txTypeNamesMap[TransactionType.POISON_MICROBLOCK] = 'Poison-microblock'),
  _txTypeNamesMap);
function getTxTypeName(tx) {
  return txTypeNamesMap[tx.tx_type];
}
// TODO - use this for issue 2695  - Show memo for transactions
var getMemoString = function getMemoString(string) {
  return string
    ? Buffer.from(string.replace('0x', '').replace(/^(0{2})+|(0{2})+$/g, ''), 'hex').toString(
        'utf8'
      )
    : null;
};

export {
  getAssetName,
  getAssetStringParts,
  getContractName,
  getFunctionName,
  getMemoString,
  getRecipientAddress,
  getTxTitle,
  getTxTypeName,
  hasMemo,
  isPendingTx,
  txTypeNamesMap,
};
//# sourceMappingURL=tx.esm.js.map
