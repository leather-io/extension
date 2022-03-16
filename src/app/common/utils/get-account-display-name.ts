// This method exists to replicate the behaviour of the method by the same name
// from `@stacks/wallet-sdk`. This method demands that type `Account` is given,
// despite the fact only two properties are used. This means that, even if you
// have the necessary properties, you can't use the method as unneeded
// properties are unavailable.
interface GetAccountDisplayNameArgs {
  username?: string;
  index: number;
}
export function getAccountDisplayName(args: GetAccountDisplayNameArgs) {
  if (args.username) {
    return args.username.split('.')[0];
  }
  return `Account ${args.index + 1}`;
}
