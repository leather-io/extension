import {
  useConfigFeeEstimationsMaxEnabled,
  useConfigFeeEstimationsMaxValues,
  useConfigFeeEstimationsMinEnabled,
  useConfigFeeEstimationsMinValues,
} from '@app/query/hiro-config/hiro-config.query';

const defaultFeeEstimationsMaxValues = [500000, 750000, 2000000];
const defaultFeeEstimationsMinValues = [2500, 3000, 3500];

export function useFeeEstimationsMaxValues() {
  // Get it first from the config
  const configFeeEstimationsMaxEnabled = useConfigFeeEstimationsMaxEnabled();
  const configFeeEstimationsMaxValues = useConfigFeeEstimationsMaxValues();
  // Only when the remote config file explicitly sets the maxValuesEnabled as false, we return no max cap for fees
  if (configFeeEstimationsMaxEnabled === false) return;
  return configFeeEstimationsMaxValues || defaultFeeEstimationsMaxValues;
}

export function useFeeEstimationsMinValues() {
  // Get it first from the config
  const configFeeEstimationsMinEnabled = useConfigFeeEstimationsMinEnabled();
  const configFeeEstimationsMinValues = useConfigFeeEstimationsMinValues();
  // Only when the remote config file explicitly sets the minValuesEnabled as false, we return no min cap for fees
  if (configFeeEstimationsMinEnabled === false) return;
  return configFeeEstimationsMinValues || defaultFeeEstimationsMinValues;
}
