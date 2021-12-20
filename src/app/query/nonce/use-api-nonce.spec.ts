import { correctNextNonce } from '@app/common/hooks/account/use-next-tx-nonce';
import { AddressNonces } from '@stacks/blockchain-api-client/lib/generated';

describe(correctNextNonce.name, () => {
  test('normal behavior', () => {
    const response1: AddressNonces = {
      last_executed_tx_nonce: 53,
      last_mempool_tx_nonce: null,
      possible_next_nonce: 54,
      detected_missing_nonces: [],
    };
    expect(correctNextNonce(response1)?.nonce).toEqual(54);
    expect(correctNextNonce(response1)?.isMissing).toEqual(false);
  });

  test('with a missing nonce', () => {
    const response1: AddressNonces = {
      last_executed_tx_nonce: 48,
      last_mempool_tx_nonce: null,
      possible_next_nonce: 54,
      detected_missing_nonces: [49],
    };
    expect(correctNextNonce(response1)?.nonce).toEqual(49);
    expect(correctNextNonce(response1)?.isMissing).toEqual(true);
  });

  test('possible_next_nonce is less than missing nonce', () => {
    const response1: AddressNonces = {
      last_executed_tx_nonce: 48,
      last_mempool_tx_nonce: null,
      possible_next_nonce: 24,
      detected_missing_nonces: [49],
    };
    expect(correctNextNonce(response1)?.nonce).toEqual(49);
    expect(correctNextNonce(response1)?.isMissing).toEqual(true);
  });

  test('invalid state: last_executed_tx_nonce is more or equal than missing nonce', () => {
    const response1: AddressNonces = {
      last_executed_tx_nonce: 49,
      last_mempool_tx_nonce: null,
      possible_next_nonce: 50,
      detected_missing_nonces: [49],
    };
    expect(correctNextNonce(response1)?.nonce).toEqual(50); // fallback to possible_next_nonce
    expect(correctNextNonce(response1)?.isMissing).toEqual(false);
  });

  test('Initial state', () => {
    const response1: AddressNonces = {
      last_executed_tx_nonce: null,
      last_mempool_tx_nonce: null,
      possible_next_nonce: 0,
      detected_missing_nonces: [],
    };
    expect(correctNextNonce(response1)?.nonce).toEqual(0); // fallback to possible_next_nonce
    expect(correctNextNonce(response1)?.isMissing).toEqual(false);
  });

  test('With last_mempool_tx_nonce', () => {
    const response1: AddressNonces = {
      last_executed_tx_nonce: 70,
      last_mempool_tx_nonce: 72,
      possible_next_nonce: 73,
      detected_missing_nonces: [71],
    };
    expect(correctNextNonce(response1)?.nonce).toEqual(71);
    expect(correctNextNonce(response1)?.isMissing).toEqual(true);
  });

  test('With many missing nonce and handling order', () => {
    const response1: AddressNonces = {
      detected_missing_nonces: [73, 71],
      last_executed_tx_nonce: 70,
      last_mempool_tx_nonce: 74,
      possible_next_nonce: 75,
    };
    expect(correctNextNonce(response1)?.nonce).toEqual(71);
    expect(correctNextNonce(response1)?.isMissing).toEqual(true);

    const response2: AddressNonces = {
      detected_missing_nonces: [71, 73],
      last_executed_tx_nonce: 70,
      last_mempool_tx_nonce: 74,
      possible_next_nonce: 75,
    };
    expect(correctNextNonce(response2)?.nonce).toEqual(71);
    expect(correctNextNonce(response2)?.isMissing).toEqual(true);
  });
});
