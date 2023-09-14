const dotenv = require('dotenv');

async function globalSetup() {
  dotenv.config({
    path: '.env',
    override: true,
  });
}

module.exports = globalSetup;
