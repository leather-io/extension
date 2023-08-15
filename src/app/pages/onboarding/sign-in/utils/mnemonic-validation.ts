import { getDefaultWordlist, wordlists } from 'bip39';
import * as yup from 'yup';

function isValidMnemonic(word: string): boolean {
  return wordlists[getDefaultWordlist()].includes(word);
}

// YUP validation of dynamic field names => https://github.com/jquense/yup/issues/130
function mapRules<T>(map: Record<string, unknown>, rule: T): Record<string, T> {
  return Object.keys(map).reduce((newMap, key) => ({ ...newMap, [key]: rule }), {});
}

// field names are dynamically generated
const dynamicObjectValue = yup.string().test({
  message: 'Not a valid BIP39 word',
  test(value) {
    if (!value) return false;
    return isValidMnemonic(value);
  },
});

export const validationSchema = yup.lazy(map =>
  yup.object(mapRules<typeof dynamicObjectValue>(map, dynamicObjectValue))
);
