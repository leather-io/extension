import { useFormikContext } from "formik";
import { SwapFormValues } from "./use-swap";
import { getSwapType } from "../swap.utils";

export function useSwapType() {
  const { values } = useFormikContext<SwapFormValues>();
  return getSwapType(values);
}
