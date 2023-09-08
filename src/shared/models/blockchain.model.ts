import { LiteralUnion } from '@shared/utils/type-utils';

export type Blockchains = LiteralUnion<'bitcoin' | 'stacks', string>;
