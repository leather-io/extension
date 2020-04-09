import express, { Request, Response } from 'express';
import cors from 'cors';
import { makeSTXTokenTransfer, TransactionVersion } from '@blockstack/stacks-transactions';
import BigNum from 'bn.js';

export const StacksController = express.Router();

StacksController.use(cors());

StacksController.post('/faucet', (req: Request, res: Response) => {
  try {
    const { address } = req.query;

    const tx = makeSTXTokenTransfer(address, new BigNum(10e3), new BigNum(10), process.env.FAUCET_PRIVATE_KEY, {
      nonce: new BigNum(0),
      version: TransactionVersion.Testnet,
      memo: 'Faucet',
    });

    const hex = tx.serialize().toString('hex');

    res.json({
      success: true,
      tx: hex,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});
