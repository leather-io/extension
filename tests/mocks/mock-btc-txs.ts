import type { BitcoinTx } from '@leather.io/models';

export const mockBitcoinTestnetAddress = 'tb1qxy5r9rlmpcxgwp92x2594q3gg026y4kdv2rsl8';

// multiple inputs and outputs
export const mockPendingTxs1: BitcoinTx[] = [
  {
    txid: '7438bd24579108a85fbf77756e7b9c87238b947dd0f858f6e30bad4f4d6d557a',
    version: 2,
    locktime: 0,
    vin: [
      {
        txid: '8192e8e20088c5f052fc7351b86b8f60a9454937860b281227e53e19f3e9c3f6',
        vout: 0,
        prevout: {
          scriptpubkey: '00143128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 3128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_type: 'v0_p2wpkh',
          scriptpubkey_address: 'tb1qxy5r9rlmpcxgwp92x2594q3gg026y4kdv2rsl8',
          value: 10000,
        },
        scriptsig: '',
        scriptsig_asm: '',
        witness: [
          '3045022100bb1fbaf38d346877383c1ad5a6e255cd5fea4e68e7bd4687dc5e1f9f96e98118022019d8990149b81242c79b600b7e37362055a7413acda4cd553ba0b61564a5284901',
          '02e442dd5aa06eafd0fccd76971f4035b05bee611470153f7f1e0e70f81df0e130',
        ],
        is_coinbase: false,
        sequence: 4294967295,
      },
      {
        txid: 'c715ea469c8d794f6dd7e0043148631f69d411c428ef0ab2b04e4528ffe8319f',
        vout: 0,
        prevout: {
          scriptpubkey: '00143128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 3128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_type: 'v0_p2wpkh',
          scriptpubkey_address: 'tb1qxy5r9rlmpcxgwp92x2594q3gg026y4kdv2rsl8',
          value: 10000,
        },
        scriptsig: '',
        scriptsig_asm: '',
        witness: [
          '3045022100827c37bd0c552be4de60d5bbd3d9bdd8287ff81ff18291d1b53a7e11dd7970b802202039d21822ad277ad566fefa8a9d64911303ced0826b5e0c938b1e239308cac401',
          '02e442dd5aa06eafd0fccd76971f4035b05bee611470153f7f1e0e70f81df0e130',
        ],
        is_coinbase: false,
        sequence: 4294967295,
      },
    ],
    vout: [
      {
        scriptpubkey: '00148027825ee06ad337f9716df8137a1b651163c5b0',
        scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 8027825ee06ad337f9716df8137a1b651163c5b0',
        scriptpubkey_type: 'v0_p2wpkh',
        scriptpubkey_address: 'tb1qsqncyhhqdtfn07t3dhupx7smv5gk83ds6k0gfa',
        value: 10000,
      },
      {
        scriptpubkey: '00143128328ffb0e0c8704aa32a85a822843d5a256cd',
        scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 3128328ffb0e0c8704aa32a85a822843d5a256cd',
        scriptpubkey_type: 'v0_p2wpkh',
        scriptpubkey_address: 'tb1qxy5r9rlmpcxgwp92x2594q3gg026y4kdv2rsl8',
        value: 5835,
      },
    ],
    size: 372,
    weight: 834,
    fee: 4165,
    status: {
      confirmed: false,
    },
  },
];

// multiple transactions
export const mockPendingTxs2: BitcoinTx[] = [
  {
    txid: '7438bd24579108a85fbf77756e7b9c87238b947dd0f858f6e30bad4f4d6d557a',
    version: 2,
    locktime: 0,
    vin: [
      {
        txid: '8192e8e20088c5f052fc7351b86b8f60a9454937860b281227e53e19f3e9c3f6',
        vout: 0,
        prevout: {
          scriptpubkey: '00143128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 3128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_type: 'v0_p2wpkh',
          scriptpubkey_address: 'tb1qxy5r9rlmpcxgwp92x2594q3gg026y4kdv2rsl8',
          value: 10000,
        },
        scriptsig: '',
        scriptsig_asm: '',
        witness: [
          '3045022100bb1fbaf38d346877383c1ad5a6e255cd5fea4e68e7bd4687dc5e1f9f96e98118022019d8990149b81242c79b600b7e37362055a7413acda4cd553ba0b61564a5284901',
          '02e442dd5aa06eafd0fccd76971f4035b05bee611470153f7f1e0e70f81df0e130',
        ],
        is_coinbase: false,
        sequence: 4294967295,
      },
      {
        txid: 'c715ea469c8d794f6dd7e0043148631f69d411c428ef0ab2b04e4528ffe8319f',
        vout: 0,
        prevout: {
          scriptpubkey: '00143128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 3128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_type: 'v0_p2wpkh',
          scriptpubkey_address: 'tb1qxy5r9rlmpcxgwp92x2594q3gg026y4kdv2rsl8',
          value: 10000,
        },
        scriptsig: '',
        scriptsig_asm: '',
        witness: [
          '3045022100827c37bd0c552be4de60d5bbd3d9bdd8287ff81ff18291d1b53a7e11dd7970b802202039d21822ad277ad566fefa8a9d64911303ced0826b5e0c938b1e239308cac401',
          '02e442dd5aa06eafd0fccd76971f4035b05bee611470153f7f1e0e70f81df0e130',
        ],
        is_coinbase: false,
        sequence: 4294967295,
      },
    ],
    vout: [
      {
        scriptpubkey: '00148027825ee06ad337f9716df8137a1b651163c5b0',
        scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 8027825ee06ad337f9716df8137a1b651163c5b0',
        scriptpubkey_type: 'v0_p2wpkh',
        scriptpubkey_address: 'tb1qsqncyhhqdtfn07t3dhupx7smv5gk83ds6k0gfa',
        value: 10000,
      },
      {
        scriptpubkey: '00143128328ffb0e0c8704aa32a85a822843d5a256cd',
        scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 3128328ffb0e0c8704aa32a85a822843d5a256cd',
        scriptpubkey_type: 'v0_p2wpkh',
        scriptpubkey_address: 'tb1qxy5r9rlmpcxgwp92x2594q3gg026y4kdv2rsl8',
        value: 5835,
      },
    ],
    size: 372,
    weight: 834,
    fee: 4165,
    status: {
      confirmed: false,
    },
  },
  {
    txid: '7438bd24579108a85fbf77756e7b9c87238b947dd0f858f6e30bad4f4d6d557a',
    version: 2,
    locktime: 0,
    vin: [
      {
        txid: '8192e8e20088c5f052fc7351b86b8f60a9454937860b281227e53e19f3e9c3f6',
        vout: 0,
        prevout: {
          scriptpubkey: '00143128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 3128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_type: 'v0_p2wpkh',
          scriptpubkey_address: 'tb1qxy5r9rlmpcxgwp92x2594q3gg026y4kdv2rsl8',
          value: 10000,
        },
        scriptsig: '',
        scriptsig_asm: '',
        witness: [
          '3045022100bb1fbaf38d346877383c1ad5a6e255cd5fea4e68e7bd4687dc5e1f9f96e98118022019d8990149b81242c79b600b7e37362055a7413acda4cd553ba0b61564a5284901',
          '02e442dd5aa06eafd0fccd76971f4035b05bee611470153f7f1e0e70f81df0e130',
        ],
        is_coinbase: false,
        sequence: 4294967295,
      },
      {
        txid: 'c715ea469c8d794f6dd7e0043148631f69d411c428ef0ab2b04e4528ffe8319f',
        vout: 0,
        prevout: {
          scriptpubkey: '00143128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 3128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_type: 'v0_p2wpkh',
          scriptpubkey_address: 'tb1qxy5r9rlmpcxgwp92x2594q3gg026y4kdv2rsl8',
          value: 10000,
        },
        scriptsig: '',
        scriptsig_asm: '',
        witness: [
          '3045022100827c37bd0c552be4de60d5bbd3d9bdd8287ff81ff18291d1b53a7e11dd7970b802202039d21822ad277ad566fefa8a9d64911303ced0826b5e0c938b1e239308cac401',
          '02e442dd5aa06eafd0fccd76971f4035b05bee611470153f7f1e0e70f81df0e130',
        ],
        is_coinbase: false,
        sequence: 4294967295,
      },
    ],
    vout: [
      {
        scriptpubkey: '00148027825ee06ad337f9716df8137a1b651163c5b0',
        scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 8027825ee06ad337f9716df8137a1b651163c5b0',
        scriptpubkey_type: 'v0_p2wpkh',
        scriptpubkey_address: 'tb1qsqncyhhqdtfn07t3dhupx7smv5gk83ds6k0gfa',
        value: 10000,
      },
      {
        scriptpubkey: '00143128328ffb0e0c8704aa32a85a822843d5a256cd',
        scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 3128328ffb0e0c8704aa32a85a822843d5a256cd',
        scriptpubkey_type: 'v0_p2wpkh',
        scriptpubkey_address: 'tb1qxy5r9rlmpcxgwp92x2594q3gg026y4kdv2rsl8',
        value: 5835,
      },
    ],
    size: 372,
    weight: 834,
    fee: 4165,
    status: {
      confirmed: false,
    },
  },
];

// one input and many outputs
export const mockPendingTxs3: BitcoinTx[] = [
  {
    txid: '7438bd24579108a85fbf77756e7b9c87238b947dd0f858f6e30bad4f4d6d557a',
    version: 2,
    locktime: 0,
    vin: [
      {
        txid: '8192e8e20088c5f052fc7351b86b8f60a9454937860b281227e53e19f3e9c3f6',
        vout: 0,
        prevout: {
          scriptpubkey: '00143128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 3128328ffb0e0c8704aa32a85a822843d5a256cd',
          scriptpubkey_type: 'v0_p2wpkh',
          scriptpubkey_address: 'tb1qxy5r9rlmpcxgwp92x2594q3gg026y4kdv2rsl8',
          value: 20000,
        },
        scriptsig: '',
        scriptsig_asm: '',
        witness: [
          '3045022100bb1fbaf38d346877383c1ad5a6e255cd5fea4e68e7bd4687dc5e1f9f96e98118022019d8990149b81242c79b600b7e37362055a7413acda4cd553ba0b61564a5284901',
          '02e442dd5aa06eafd0fccd76971f4035b05bee611470153f7f1e0e70f81df0e130',
        ],
        is_coinbase: false,
        sequence: 4294967295,
      },
    ],
    vout: [
      {
        scriptpubkey: '00148027825ee06ad337f9716df8137a1b651163c5b0',
        scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 8027825ee06ad337f9716df8137a1b651163c5b0',
        scriptpubkey_type: 'v0_p2wpkh',
        scriptpubkey_address: 'tb1qsqncyhhqdtfn07t3dhupx7smv5gk83ds6k0gfa',
        value: 10000,
      },
      {
        scriptpubkey: '00143128328ffb0e0c8704aa32a85a822843d5a256cd',
        scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 3128328ffb0e0c8704aa32a85a822843d5a256cd',
        scriptpubkey_type: 'v0_p2wpkh',
        scriptpubkey_address: 'tb1qxy5r9rlmpcxgwp92x2594q3gg026y4kdv2rsl8',
        value: 5835,
      },
    ],
    size: 372,
    weight: 834,
    fee: 4165,
    status: {
      confirmed: false,
    },
  },
];
