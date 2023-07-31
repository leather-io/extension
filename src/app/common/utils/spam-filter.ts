const urlRegex =
  /(http|https|ftp)|(((http|ftp|https):\/\/)?(((http|ftp|https):\/\/)?(([\w.-]*)\.([\w]*))))/g;
const spamWords = ['won', 'win', 'click'];
export const spamReplacement = 'Unknown token';

function spamUrlFilter(input: string) {
  return input.match(urlRegex);
}

function spamWordFilter(input: string): boolean {
  const containsSpam = (element: string) => input.toLowerCase().includes(element);
  return spamWords.some(containsSpam);
}

export function spamFilter(input: string): string {
  const urlFound = spamUrlFilter(input);
  const spamWordsFound = spamWordFilter(input);

  if (urlFound || spamWordsFound) {
    return spamReplacement;
  }

  return input;
}
