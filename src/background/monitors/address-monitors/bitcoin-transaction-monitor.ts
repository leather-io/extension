import axios from 'axios';

import { isDefined } from '@leather.io/utils';

import { DEBUG_TX_MONITOR } from '@shared/environment';
import { logger } from '@shared/logger';

import type { AddressMonitor, MonitoredAddress } from '../address-monitor';
import {
  type MempoolWsBitcoinTxMessage,
  type MempoolWsBtcPrice,
  readMempooWsBtcPriceUsd,
  readMempoolWsBitcoinTxAddressResult,
} from './bitcoin-transaction-monitor/mempool-ws';

function logTxMonitorEvent(message: string, ...args: unknown[]) {
  if (!DEBUG_TX_MONITOR) return;
  logger.debug(message, ...args);
}

export function createBitcoinTransactionMonitor(addresses: MonitoredAddress[]): AddressMonitor {
  let _ws: WebSocket | null = null;
  let _addresses: MonitoredAddress[];
  let _keepAliveInterval: NodeJS.Timeout | null = null;
  let _btcPriceUsd: number = 0;

  _addresses = filterAddresses(addresses);

  // only connect if we have addresses at initialization
  if (addresses.length > 0) {
    connect();
  }

  function syncAddresses(addresses: MonitoredAddress[]) {
    _addresses = filterAddresses(addresses);

    if (_addresses.length > 0) {
      if (!_ws || (_ws.readyState !== _ws.CONNECTING && _ws.readyState !== _ws.OPEN)) {
        connect();
      } else if (_ws.readyState === _ws.OPEN) {
        sendWsTrackAddressSubscribe();
      }
    } else {
      logTxMonitorEvent('Disconnecting Bitcon Tx Monitor');
      cleanup();
    }
  }

  function filterAddresses(addresses: MonitoredAddress[]) {
    return addresses.filter(a => a.chain === 'bitcoin');
  }

  function startKeepAlive() {
    if (_keepAliveInterval) {
      clearInterval(_keepAliveInterval);
    }

    _keepAliveInterval = setInterval(() => {
      if (_ws?.readyState === WebSocket.OPEN) {
        _ws.send(
          JSON.stringify({
            ping: 'keep-alive',
          })
        );
      }
    }, 20 * 1000);
  }

  function sendWsTrackAddressSubscribe() {
    const addresses = _addresses.map(a => a.address);
    logTxMonitorEvent(`Subscribing to ${addresses.length} Track Addresses`);
    _ws!.send(
      JSON.stringify({
        'track-addresses': addresses,
      })
    );
  }

  function cleanup() {
    if (_keepAliveInterval) {
      clearInterval(_keepAliveInterval);
      _keepAliveInterval = null;
    }

    if (_ws) {
      _ws.close();
      _ws = null;
    }
  }

  function connect() {
    logTxMonitorEvent('Connecting Bitcoin Tx Monitor');

    cleanup();

    _ws = new WebSocket('wss://leather.mempool.space/api/v1/ws');

    _ws.onopen = async () => {
      logTxMonitorEvent('Connected to Mempool WebSocket');
      sendWsTrackAddressSubscribe();
      startKeepAlive();
      fetchBtcPrice();
    };

    _ws.onmessage = async event => {
      await handleMessageEvent(event);
    };

    _ws.onerror = error => {
      logger.error('Mempool WebSocket Error, ', error);
    };

    _ws.onclose = event => {
      logTxMonitorEvent('Disconnected from Mempool WebSocket.', event.reason);
      if (_addresses.length > 0) {
        setTimeout(() => {
          connect();
        }, 300);
      }
    };
  }

  function fetchBtcPrice() {
    axios
      .get<MempoolWsBtcPrice>('https://leather.mempool.space/api/v1/prices')
      .then(res => {
        _btcPriceUsd = readMempooWsBtcPriceUsd(res.data);
      })
      .catch(e => {
        logTxMonitorEvent('Unable to fetch BTC price, ', e);
      });
  }

  async function handleMessageEvent(event: MessageEvent<any>) {
    const message = JSON.parse(event.data);
    if (message['multi-address-transactions']) {
      await handleTransactionMessage(message);
    } else if (message['conversions']) {
      _btcPriceUsd = readMempooWsBtcPriceUsd(message['conversions']);
    }
  }

  async function handleTransactionMessage(msg: MempoolWsBitcoinTxMessage) {
    try {
      for (const address of Object.keys(msg['multi-address-transactions'])
        .filter(address => msg['multi-address-transactions'][address].confirmed.length > 0) // only confirmed transactions
        .map(address => _addresses.find(a => a.address === address)) // only currently monitored addresses
        .filter(isDefined)) {
        const transaction = msg['multi-address-transactions'][address.address].confirmed[0];

        const result = readMempoolWsBitcoinTxAddressResult(address.address, transaction);

        if (result.satValue > 0) {
          const btcValue = result.satValue / 100_000_000;
          const usdValue = btcValue * _btcPriceUsd;
          await sendNotification(
            `You ${result.isSender ? 'sent' : 'received'} Bitcoin!`,
            `Account ${address.accountIndex + 1} ${result.isSender ? 'sent' : 'received'} ${btcValue} BTC ($${usdValue.toFixed(2)})`
          );
        }
      }
    } catch (e) {
      logger.error('Unable to handle WS message: ', e);
    }
  }

  async function sendNotification(title: string, message: string) {
    const iconUrl = chrome.runtime.getURL('assets/icons/leather-icon-128.png');
    chrome.notifications.create({
      type: 'basic',
      iconUrl,
      title,
      message,
      priority: 0,
    });
  }

  return {
    syncAddresses,
  };
}
