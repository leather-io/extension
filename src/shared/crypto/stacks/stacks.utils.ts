export const stxDerivationWithAccount = `m/44'/5757'/0'/0/{account}`;
const stxIdentityDerivationWithAccount = `m/888'/0'/{account}'`;

function getAccountIndexFromDerivationPathFactory(derivationPath: string) {
  return (account: number) => derivationPath.replace('{account}', account.toString());
}

export const getStxDerivationPath =
  getAccountIndexFromDerivationPathFactory(stxDerivationWithAccount);

export const getIdentityDerivationPath = getAccountIndexFromDerivationPathFactory(
  stxIdentityDerivationWithAccount
);
