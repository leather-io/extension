import { hexToBytes } from '@stacks/common';

import { OrdApiInscriptionTxOutput } from '@app/query/bitcoin/ordinals/ordinals-aware-utxo.query';

import {
  NonWitnessUtxo,
  PsbtInputForUi,
} from '../../src/app/pages/psbt-request/hooks/use-psbt-decoded-request';

export const mockPsbtUnsignedOutputs = [
  {
    amount: BigInt(1200),
    script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
  },
  {
    amount: BigInt(10000),
    script: hexToBytes('5120286626028a2d352bae8dcdfa750025d04ce7f5eb6649a4ddb9ef98eba6315f47'),
  },
  {
    amount: BigInt(98500),
    script: hexToBytes('a914fdb87fb236e8530cd4dd97ad9ebe810c265aa0ef87'),
  },
  {
    amount: BigInt(1500),
    script: hexToBytes('0014213e3440d21efb9e8e4000fadb90e9c8ef5e3c8d'),
  },
];

const mockPsbtInputNonWitnessUtxo: NonWitnessUtxo = {
  version: 2,
  segwitFlag: true,
  inputs: [
    {
      txid: hexToBytes('e41ca83d77ab711923f25fc88e13d273e4f3828f2d1d6e2576d4b29bcbb32f38'),
      index: 1,
      finalScriptSig: hexToBytes(''),
      sequence: 4294967295,
    },
    {
      txid: hexToBytes('f177c3d4ba24e18356c479d660bbb584d8a78be344c82a3e86b32aa6abd0195f'),
      index: 0,
      finalScriptSig: hexToBytes(''),
      sequence: 4294967295,
    },
    {
      txid: hexToBytes('80de4905b7de5acf913dd68e9d2953df04231854ee4b5e06e7b0821a991200de'),
      index: 0,
      finalScriptSig: hexToBytes(''),
      sequence: 4294967295,
    },
    {
      txid: hexToBytes('f177c3d4ba24e18356c479d660bbb584d8a78be344c82a3e86b32aa6abd0195f'),
      index: 1,
      finalScriptSig: hexToBytes(''),
      sequence: 4294967295,
    },
    {
      txid: hexToBytes('f177c3d4ba24e18356c479d660bbb584d8a78be344c82a3e86b32aa6abd0195f'),
      index: 2,
      finalScriptSig: hexToBytes(''),
      sequence: 4294967295,
    },
  ],
  outputs: [
    {
      amount: BigInt(600),
      script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
    },
    {
      amount: BigInt(600),
      script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
    },
    {
      amount: BigInt(112568),
      script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
    },
    {
      amount: BigInt(224743),
      script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
    },
  ],
  witnesses: [
    [
      '30440220437e1fd865a1c7201a54ce4fe9729d2966563681812b2c7f71f78c8344b3931502204503703f957f0701cfc208b05b8deb396a6a6fcaae5b51bbc6d3ec1cb832d55e01',
      '039aa0f222ca60f0a4d03ae8047d5972856af82ff186d1b99186fc7b44f0d737c6',
    ],
    [
      '3045022100e32250233e40fc4f89a0f1d427d46aaea0a2b1f677f81d6e6542002efb52a21e02206430455c2098f82ec17f347832d022acc4d9bc7f4486582c3bb0b47ab254c9a901',
      '039aa0f222ca60f0a4d03ae8047d5972856af82ff186d1b99186fc7b44f0d737c6',
    ],
    [
      '304402201dfb85876c7ccc56a2f8691780dd8e0ddb6c117f8cf46441a0a26a4b8f6711ca022033c4d5b59304dbe2828d5498795909ee6143de86ed67aeea928b4e39bf3496f601',
      '039aa0f222ca60f0a4d03ae8047d5972856af82ff186d1b99186fc7b44f0d737c6',
    ],
    [
      '3044022027c01031326e714276c22c65713a9d0b38f082dbf36afd1050da13f1af44f384022070219f1b496eea8f14cd038c6962e5b4ef6b0a6c1439ffeec7c2c80b540a838a01',
      '039aa0f222ca60f0a4d03ae8047d5972856af82ff186d1b99186fc7b44f0d737c6',
    ],
    [
      '3045022100acf58365b40c5cafdb7707dacf0921dc80072dc3c81953b234f1de301b597cbf02205776a4a3cc840cf923be5c5579a977607e74f2c00b6c2c099c26810b51f040ae01',
      '039aa0f222ca60f0a4d03ae8047d5972856af82ff186d1b99186fc7b44f0d737c6',
    ],
  ],
  lockTime: 0,
};

const mockPsbtInputNonWitnessUtxoWithInscription: NonWitnessUtxo = {
  version: 1,
  segwitFlag: true,
  inputs: [
    {
      txid: hexToBytes('c4c9c967162e72f4a0414dfc4f499fe75f423da8c6fbda2645962fe504a76b74'),
      index: 0,
      finalScriptSig: hexToBytes(''),
      sequence: 4294967293,
    },
  ],
  outputs: [
    {
      amount: BigInt(9556),
      script: hexToBytes('512078f5386cce73363387d7904d5cb25d52bf42247baaaf92de03094eefbeb7d2fa'),
    },
  ],
  witnesses: [
    [
      '0cf260fbf470c7128f2ce76bdcbf0d00cbfa79cfabf4277d64c0a58f66d1e4027395e9cabf09ff88bf3df3dace1fa6d0e112fa371acfd09144794e28e21ec0ad',
    ],
  ],
  lockTime: 0,
};

const mockUnsignedUtxoInscription: OrdApiInscriptionTxOutput = {
  address: 'bc1p3rfd76c37af87e23g4z6tts0zu52u6frjh92m9uq5evxy0sr7hvslly59y',
  all_inscriptions: [],
  inscriptions: '/inscription/ff4503ab9048d6d0ff4e23def81b614d5270d341ce993992e93902ceb0d4ed79i0',
  script_pubkey:
    'OP_PUSHNUM_1 OP_PUSHBYTES_32 88d2df6b11f7527f65514545a5ae0f1728ae692395caad9780a658623e03f5d9',
  transaction: '/tx/ff4503ab9048d6d0ff4e23def81b614d5270d341ce993992e93902ceb0d4ed79',
  value: '9556',
};

const mockPsbtUnsignedUtxos: OrdApiInscriptionTxOutput[] = [
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    all_inscriptions: [],
    inscriptions: '',
    script_pubkey: 'OP_0 OP_PUSHBYTES_20 66124290d2fc62f8cb83c0e15836a548e43dcade',
    transaction: '/tx/f177c3d4ba24e18356c479d660bbb584d8a78be344c82a3e86b32aa6abd0195f',
    value: '600',
  },
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    all_inscriptions: [],
    inscriptions: '',
    script_pubkey: 'OP_0 OP_PUSHBYTES_20 66124290d2fc62f8cb83c0e15836a548e43dcade',
    transaction: '/tx/f177c3d4ba24e18356c479d660bbb584d8a78be344c82a3e86b32aa6abd0195f',
    value: '600',
  },
  mockUnsignedUtxoInscription,
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    all_inscriptions: [],
    inscriptions: '',
    script_pubkey: 'OP_0 OP_PUSHBYTES_20 66124290d2fc62f8cb83c0e15836a548e43dcade',
    transaction: '/tx/f177c3d4ba24e18356c479d660bbb584d8a78be344c82a3e86b32aa6abd0195f',
    value: '292891',
  },
];

export const mockPsbtInputs: PsbtInputForUi[] = [
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
    unsignedUtxo: undefined,
    value: 600,
    witnessUtxo: {
      amount: BigInt(600),
      script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
    },
  },
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
    unsignedUtxo: undefined,
    value: 600,
    witnessUtxo: {
      amount: BigInt(600),
      script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
    },
  },
  {
    address: 'bc1p0r6nsmxwwvmr8p7hjpx4evja22l5yfrm42he9hsrp98wl04h6taq4t0af2',
    nonWitnessUtxo: mockPsbtInputNonWitnessUtxoWithInscription,
    unsignedUtxo: mockUnsignedUtxoInscription,
    value: 9556,
    witnessUtxo: {
      amount: BigInt(9556),
      script: hexToBytes('512078f5386cce73363387d7904d5cb25d52bf42247baaaf92de03094eefbeb7d2fa'),
    },
  },
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
    unsignedUtxo: undefined,
    value: 115166,
    witnessUtxo: {
      amount: BigInt(112568),
      script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
    },
  },
];

export const mockInputOutputPairs = [
  {
    inputs: [
      {
        address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
        nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
        witnessUtxo: {
          amount: BigInt(600),
          script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
        },
        unsignedUtxo: undefined,
        value: 1200,
      },
    ],
    output: {
      amount: BigInt(1200),
      script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
    },
  },
  {
    inputs: [
      {
        address: 'bc1p0r6nsmxwwvmr8p7hjpx4evja22l5yfrm42he9hsrp98wl04h6taq4t0af2',
        nonWitnessUtxo: mockPsbtInputNonWitnessUtxoWithInscription,
        witnessUtxo: {
          amount: BigInt(9556),
          script: hexToBytes(
            '512078f5386cce73363387d7904d5cb25d52bf42247baaaf92de03094eefbeb7d2fa'
          ),
        },
        unsignedUtxo: mockUnsignedUtxoInscription,
        value: 9556,
      },
      {
        address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
        nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
        witnessUtxo: {
          amount: BigInt(112568),
          script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
        },
        unsignedUtxo: undefined,
        value: 115166,
      },
    ],
    output: {
      amount: BigInt(10000),
      script: hexToBytes('5120286626028a2d352bae8dcdfa750025d04ce7f5eb6649a4ddb9ef98eba6315f47'),
    },
  },
  {
    inputs: [
      {
        address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
        nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
        witnessUtxo: {
          amount: BigInt(112568),
          script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
        },
        unsignedUtxo: undefined,
        value: 115166,
      },
    ],
    output: {
      amount: BigInt(98500),
      script: hexToBytes('a914fdb87fb236e8530cd4dd97ad9ebe810c265aa0ef87'),
    },
  },
  {
    inputs: [
      {
        address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
        nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
        witnessUtxo: {
          amount: BigInt(112568),
          script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
        },
        unsignedUtxo: undefined,
        value: 115166,
      },
    ],
    output: {
      amount: BigInt(1500),
      script: hexToBytes('0014213e3440d21efb9e8e4000fadb90e9c8ef5e3c8d'),
    },
  },
];

export const mockPsbtInputsWithNonWitnessOnly: PsbtInputForUi[] = [
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
    unsignedUtxo: mockPsbtUnsignedUtxos[0],
    witnessUtxo: undefined,
    value: 600,
  },
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
    unsignedUtxo: mockPsbtUnsignedUtxos[1],
    witnessUtxo: undefined,
    value: 600,
  },
  {
    address: 'bc1p0r6nsmxwwvmr8p7hjpx4evja22l5yfrm42he9hsrp98wl04h6taq4t0af2',
    nonWitnessUtxo: mockPsbtInputNonWitnessUtxoWithInscription,
    unsignedUtxo: mockPsbtUnsignedUtxos[2],
    witnessUtxo: undefined,
    value: 9556,
  },
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
    unsignedUtxo: mockPsbtUnsignedUtxos[3],
    witnessUtxo: undefined,
    value: 115166,
  },
];

export const mockInputOutputPairsWithNonWitnessOnly = [
  {
    inputs: [
      {
        address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
        nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
        witnessUtxo: undefined,
        unsignedUtxo: mockPsbtUnsignedUtxos[0],
        value: 1200,
      },
    ],
    output: {
      amount: BigInt(1200),
      script: hexToBytes('001466124290d2fc62f8cb83c0e15836a548e43dcade'),
    },
  },
  {
    inputs: [
      {
        address: 'bc1p0r6nsmxwwvmr8p7hjpx4evja22l5yfrm42he9hsrp98wl04h6taq4t0af2',
        nonWitnessUtxo: mockPsbtInputNonWitnessUtxoWithInscription,
        witnessUtxo: undefined,
        unsignedUtxo: mockUnsignedUtxoInscription,
        value: 9556,
      },
      {
        address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
        nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
        witnessUtxo: undefined,
        unsignedUtxo: mockPsbtUnsignedUtxos[3],
        value: 115166,
      },
    ],
    output: {
      amount: BigInt(10000),
      script: hexToBytes('5120286626028a2d352bae8dcdfa750025d04ce7f5eb6649a4ddb9ef98eba6315f47'),
    },
  },
  {
    inputs: [
      {
        address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
        nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
        witnessUtxo: undefined,
        unsignedUtxo: mockPsbtUnsignedUtxos[3],
        value: 115166,
      },
    ],
    output: {
      amount: BigInt(98500),
      script: hexToBytes('a914fdb87fb236e8530cd4dd97ad9ebe810c265aa0ef87'),
    },
  },
  {
    inputs: [
      {
        address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
        nonWitnessUtxo: mockPsbtInputNonWitnessUtxo,
        witnessUtxo: undefined,
        unsignedUtxo: mockPsbtUnsignedUtxos[3],
        value: 115166,
      },
    ],
    output: {
      amount: BigInt(1500),
      script: hexToBytes('0014213e3440d21efb9e8e4000fadb90e9c8ef5e3c8d'),
    },
  },
];
