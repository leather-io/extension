export function warnUsersAboutDevToolsDangers() {
  if (process.env.WALLET_ENVIRONMENT !== 'production') return;

  // eslint-disable-next-line no-console
  console.log(
    '%c ⚠️ Warning:\n   Do not paste any code here.\n   This is a developer tool which could be used to steal your funds.',
    'color: red; font-size: 20px'
  );
}
