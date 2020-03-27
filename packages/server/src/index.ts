import DotEnv from 'dotenv';
import { resolve } from 'path';
import { app } from './app';

if (process.env.NODE_ENV === 'development') {
  DotEnv.config({ path: resolve(process.cwd(), '.env.sample') });
  DotEnv.config({ path: resolve(process.cwd(), '.env') });
}

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5555;

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`Listening on http://localhost:${port}`);
});
