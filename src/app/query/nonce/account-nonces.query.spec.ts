import { AddressNonces } from '@stacks/blockchain-api-client/lib/generated';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { setupHeystackEnv } from '@tests/mocks/heystack';

import { getNextNonce, NonceTypes } from './account-nonces.utils';

describe(getNextNonce, () => {
  setupHeystackEnv();

  test('possible_next_nonce', () => {
    const response: AddressNonces = {
      detected_missing_nonces: [],
      last_executed_tx_nonce: 53,
      last_mempool_tx_nonce: null,
      possible_next_nonce: 54,
    };
    const confirmedTxs: Transaction[] = [];
    const pendingTxs: MempoolTransaction[] = [];
    const { nonce, nonceType } = getNextNonce(response, confirmedTxs, pendingTxs);
    expect(nonce).toEqual(54);
    expect(nonceType).toEqual(NonceTypes.apiSuggestedNonce);
  });

  test('detected_missing_nonces', () => {
    const response: AddressNonces = {
      detected_missing_nonces: [49],
      last_executed_tx_nonce: 48,
      last_mempool_tx_nonce: null,
      possible_next_nonce: 54,
    };
    const confirmedTxs: Transaction[] = [];
    const pendingTxs: MempoolTransaction[] = [];
    const { nonce, nonceType } = getNextNonce(response, confirmedTxs, pendingTxs);
    expect(nonce).toEqual(49);
    expect(nonceType).toEqual(NonceTypes.apiSuggestedNonce);
  });

  test('possible_next_nonce is less than missing nonce', () => {
    const response: AddressNonces = {
      detected_missing_nonces: [49],
      last_executed_tx_nonce: 48,
      last_mempool_tx_nonce: null,
      possible_next_nonce: 24,
    };
    const confirmedTxs: Transaction[] = [];
    const pendingTxs: MempoolTransaction[] = [];
    const { nonce, nonceType } = getNextNonce(response, confirmedTxs, pendingTxs);
    expect(nonce).toEqual(49);
    expect(nonceType).toEqual(NonceTypes.apiSuggestedNonce);
  });

  test('invalid state: last_executed_tx_nonce is more than or equal to missing nonce', () => {
    const response: AddressNonces = {
      detected_missing_nonces: [49],
      last_executed_tx_nonce: 49,
      last_mempool_tx_nonce: null,
      possible_next_nonce: 50,
    };
    const confirmedTxs: Transaction[] = [];
    const pendingTxs: MempoolTransaction[] = [];
    const { nonce, nonceType } = getNextNonce(response, confirmedTxs, pendingTxs);
    expect(nonce).toEqual(50);
    expect(nonceType).toEqual(NonceTypes.apiSuggestedNonce);
  });

  test('new account with zero nonce', () => {
    const response: AddressNonces = {
      detected_missing_nonces: [],
      last_executed_tx_nonce: null,
      last_mempool_tx_nonce: null,
      possible_next_nonce: 0,
    };
    const confirmedTxs: Transaction[] = [];
    const pendingTxs: MempoolTransaction[] = [];
    const { nonce, nonceType } = getNextNonce(response, confirmedTxs, pendingTxs);
    expect(nonce).toEqual(0);
    expect(nonceType).toEqual(NonceTypes.apiSuggestedNonce);
  });

  test('last_mempool_tx_nonce', () => {
    const response: AddressNonces = {
      detected_missing_nonces: [71],
      last_executed_tx_nonce: 70,
      last_mempool_tx_nonce: 72,
      possible_next_nonce: 73,
    };
    const confirmedTxs: Transaction[] = [];
    const pendingTxs: MempoolTransaction[] = [
      {
        anchor_mode: 'any',
        fee_rate: '200',
        post_conditions: [],
        post_condition_mode: 'deny',
        receipt_time: 0,
        receipt_time_iso: '0',
        sender_address: 'ST2PHCPANVT8DVPSY5W2ZZ81M285Q5Z8Y6DQMZE7Z',
        sponsored: false,
        tx_id: '1',
        tx_status: 'pending',
        token_transfer: {
          amount: '10000',
          memo: '',
          recipient_address: '',
        },
        tx_type: 'token_transfer',
        nonce: 72,
      },
    ];
    const { nonce, nonceType } = getNextNonce(response, confirmedTxs, pendingTxs);
    expect(nonce).toEqual(71);
    expect(nonceType).toEqual(NonceTypes.apiSuggestedNonce);
  });

  test('multiple missing nonces', () => {
    const response1: AddressNonces = {
      detected_missing_nonces: [73, 71],
      last_executed_tx_nonce: 70,
      last_mempool_tx_nonce: 74,
      possible_next_nonce: 75,
    };
    const confirmedTxs: Transaction[] = [];
    const pendingTxs: MempoolTransaction[] = [];
    const { nonce: nonce1, nonceType: nonceType1 } = getNextNonce(
      response1,
      confirmedTxs,
      pendingTxs
    );
    expect(nonce1).toEqual(71);
    expect(nonceType1).toEqual(NonceTypes.apiSuggestedNonce);

    const response2: AddressNonces = {
      detected_missing_nonces: [71, 73],
      last_executed_tx_nonce: 70,
      last_mempool_tx_nonce: 74,
      possible_next_nonce: 75,
    };
    const { nonce: nonce2, nonceType: nonceType2 } = getNextNonce(
      response2,
      confirmedTxs,
      pendingTxs
    );
    expect(nonce2).toEqual(71);
    expect(nonceType2).toEqual(NonceTypes.apiSuggestedNonce);
  });
});
