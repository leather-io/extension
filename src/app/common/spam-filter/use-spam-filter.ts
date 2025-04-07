import { spamFilter } from '@leather.io/utils';

import { useConfigSpamFilterWhitelist } from '@app/query/common/remote-config/remote-config.query';

export function useSpamFilterWithWhitelist() {
  const whitelist = useConfigSpamFilterWhitelist();
  return (input: string) => spamFilter({ input, whitelist });
}
