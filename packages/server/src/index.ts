import DotEnv from 'dotenv';
import { app } from './app';

DotEnv.config();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5555;

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`Listening on http://localhost:${port}`);
});
