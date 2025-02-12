import { useConfigSpamFilterWhitelist } from '@leather.io/query';
import { spamFilter } from '@leather.io/utils';

export function useSpamFilterWithWhitelist() {
  const whitelist = useConfigSpamFilterWhitelist();
  return (input: string) => spamFilter({ input, whitelist });
}
