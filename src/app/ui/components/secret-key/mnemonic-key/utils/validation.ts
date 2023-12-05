import { wordlist } from '@scure/bip39/wordlists/english';
import * as yup from 'yup';

function isValidMnemonic(word: string): boolean {
  return wordlist.includes(word);
}

// YUP validation of dynamic field names => https://github.com/jquense/yup/issues/130
function mapRules<T>(map: Record<string, unknown>, rule: T): Record<string, T> {
  return Object.keys(map).reduce((newMap, key) => ({ ...newMap, [key]: rule }), {});
}

// field names are dynamically generated
const dynamicObjectValue = yup.string().test({
  test(value) {
    if (!value) return false;
    return isValidMnemonic(value);
  },
});

export const validationSchema = yup.lazy(map =>
  yup.object(mapRules<typeof dynamicObjectValue>(map, dynamicObjectValue))
);
