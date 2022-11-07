const mnemonicCrypto = require('../src/shared/crypto/mnemonic-encryption');

function main() {
  const mnemonicForm = document.querySelector('.decrypt-mnemonic-form');
  const submitButton = document.querySelector('.decrypt-mnemonic-form button');

  const originalBtnText = submitButton.textContent;

  function setPending() {
    submitButton.disabled = true;
    submitButton.textContent = 'Wait';
  }
  function setComplete() {
    submitButton.disabled = false;
    submitButton.textContent = originalBtnText;
  }

  mnemonicForm.addEventListener('submit', async event => {
    event.preventDefault();

    setPending();

    const formData = Object.fromEntries(new FormData(event.target).entries());

    try {
      const result = await mnemonicCrypto.decryptMnemonic(formData);
      console.log(result);
      alert(result.secretKey);
    } finally {
      setComplete();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => main());
