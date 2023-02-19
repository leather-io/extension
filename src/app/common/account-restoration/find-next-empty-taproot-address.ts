// import { createCounter } from '../utils/counter';
//
// const numOfEmptyAccountsToCheck = 20;
//
// interface AccountIndexActivityCheckHistory<T> {
//   index: number;
//   hasActivity: boolean;
//   activity: T;
// }
//
// function minNumberOfAccountsNotChecked(num: number) {
//   return num < numOfEmptyAccountsToCheck;
// }
//
// function anyOfLastCheckedAccountsHaveActivity<T>(arr: AccountIndexActivityCheckHistory<T>[]) {
//   return arr.slice(arr.length - numOfEmptyAccountsToCheck).some(check => check.hasActivity);
// }
//
// function returnHighestIndex<T>(arr: AccountIndexActivityCheckHistory<T>[]) {
//   return Math.max(0, ...arr.filter(check => check.hasActivity).map(check => check.index));
// }
//
// async function recurseUntilGeneratorDone(generator: AsyncGenerator): Promise<any> {
//   const result = await generator.next();
//   if (result.done) return result.value;
//   return recurseUntilGeneratorDone(generator);
// }
//
// type DoesAddressHaveActivityFn<T> = (
//   index: number
// ) => Promise<{ hasActivity: boolean; activity: T }>;
//
// interface RecurseAccountsForActivityArgs<T> {
//   doesAddressHaveActivityFn: DoesAddressHaveActivityFn<T>;
// }
//
// /**
//  * Traverses accounts sequentially for activity, and returns the activity for
//  * those accounts as defined by `doesAddressHaveActivityFn`.
//  */
// export async function traverseAccountsForActivity<T>({
//   doesAddressHaveActivityFn,
// }: RecurseAccountsForActivityArgs<T>): Promise<number> {
//   async function* findHighestAddressIndexExponent() {
//     const indexCounter = createCounter(0);
//
//     // TODO: Use TS magic to match type arg below to the one used in `doesAddressHaveActivityFn`.
//     const activity: AccountIndexActivityCheckHistory<T>[] = [];
//
//     while (activity.length === 0 || activity[activity.length - 1].hasActivity) {
//       const index = indexCounter.getValue();
//       const hasActivity = await doesAddressHaveActivityFn(index);
//       activity.push({ index, ...hasActivity });
//       indexCounter.increment();
//       yield;
//     }
//     return returnHighestIndex(activity);
//   }
//
//   const knownActivityAtIndex = await recurseUntilGeneratorDone(findHighestAddressIndexExponent());
//
//   async function* checkForMostRecentAccount() {
//     const indexCounter = createCounter(knownActivityAtIndex + 1);
//     const activity: AccountIndexActivityCheckHistory<T>[] = [];
//
//     while (
//       minNumberOfAccountsNotChecked(activity.length) ||
//       anyOfLastCheckedAccountsHaveActivity(activity)
//     ) {
//       const hasActivity = await doesAddressHaveActivityFn(indexCounter.getValue());
//       activity.push({ index: indexCounter.getValue(), hasActivity });
//       indexCounter.increment();
//       yield;
//     }
//     return returnHighestIndex(activity);
//   }
//
//   return recurseUntilGeneratorDone(checkForMostRecentAccount());
// }
