import express from 'express';
import { StacksController } from './stacks-controller';
export const app = express();

app.use('/api', StacksController);
