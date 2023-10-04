import { mockInscription1, mockInscription2 } from './mock-inscriptions';

export const mockPsbtInputs1 = [
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    index: 0,
    isMutable: false,
    toSign: true,
    txid: 'c7bb536fc3a645c8c9bad70a651f997b10c99ac8bf8c8c34229cd3895bc96f3f',
    value: 600,
  },
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    index: 1,
    isMutable: false,
    toSign: true,
    txid: 'c7bb536fc3a645c8c9bad70a651f997b10c99ac8bf8c8c34229cd3895bc96f3f',
    value: 600,
  },
  {
    address: 'bc1pwrmewwprc8k8l2k63x4advg0nx0jk50xzqnee996lm87mcuza7kq6drg2k',
    index: 0,
    inscription: mockInscription1,
    isMutable: false,
    toSign: false,
    txid: 'ba39f922074c0d338a13ac10e770a5da47ce09df8310c8d3cfaec13a347e8202',
    value: 10000,
  },
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    index: 2,
    isMutable: false,
    toSign: true,
    txid: 'c7bb536fc3a645c8c9bad70a651f997b10c99ac8bf8c8c34229cd3895bc96f3f',
    value: 96794,
  },
];

export const mockPsbtOutputs1 = [
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    isMutable: false,
    toSign: true,
    value: 1200,
  },
  {
    address: 'bc1p9pnzvq52956jht5deha82qp96pxw0a0tvey6fhdea7vwhf33tarskqq3nr',
    isMutable: false,
    toSign: true,
    value: 10000,
  },
  {
    address: '3NLVhyKWGey73pVbFAZ28nNVZB22upWZWq',
    isMutable: false,
    toSign: false,
    value: 87220,
  },
  {
    address: 'bc1qyylrgsxjrmaearjqqradhy8ferh4u0ydw4yuze',
    isMutable: false,
    toSign: false,
    value: 1780,
  },
];

export const mockPsbtInputs2 = [
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    index: 0,
    isMutable: false,
    toSign: true,
    txid: 'c7bb536fc3a645c8c9bad70a651f997b10c99ac8bf8c8c34229cd3895bc96f3f',
    value: 100,
  },
  {
    address: 'bc1pwrmewwprc8k8l2k63x4advg0nx0jk50xzqnee996lm87mcuza7kq6drg2k',
    index: 0,
    inscription: mockInscription2,
    isMutable: true,
    toSign: false,
    txid: 'ba39f922074c0d338a13ac10e770a5da47ce09df8310c8d3cfaec13a347e8202',
    value: 1000,
  },
];

export const mockPsbtOutputs2 = [
  {
    address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
    isMutable: false,
    toSign: true,
    value: 400,
  },
  {
    address: 'bc1p9pnzvq52956jht5deha82qp96pxw0a0tvey6fhdea7vwhf33tarskqq3nr',
    isMutable: false,
    toSign: true,
    value: 500,
  },
];
