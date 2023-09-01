import { MagicSwap } from "../magic/models";

export type Swap =
  | ({ type: 'magic' } & MagicSwap)
  | ({ type: 'other', test: string });
