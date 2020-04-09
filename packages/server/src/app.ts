import express from 'express';
import { StacksController } from './stacks-controller';
// import { createProxyMiddleware } from 'http-proxy-middleware';
export const app = express();

app.use('/api', StacksController);
// app.use('/v2', createProxyMiddleware('http://localhost:9000/v2', {}));
