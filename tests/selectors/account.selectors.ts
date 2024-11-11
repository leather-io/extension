export function getSwitchAccountSheetAccountNameSelector(index: number) {
  return AccountSelectors.SwitchAccountSheetAccountName.replace('{index}', index.toString());
}

export const AccountSelectors = {
  SwitchAccountSheetAccountName: 'switch-account-sheet-account-name-{index}',
};
