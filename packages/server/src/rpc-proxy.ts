import express, { Request, Response } from 'express';
import cors from 'cors';
import got from 'got';

const baseURL = process.env.STACKS_NODE_RPC_URL || 'http://localhost:9000';

const Proxy = express.Router();

Proxy.use(cors());

Proxy.get('*', (req: Request, res: Response) => {
  const url = `${baseURL}${req.originalUrl}`;
  const res = await got(url, {
    json: true,
  });
  // console.log(url);
  // console.log(res.);
  const;
});
