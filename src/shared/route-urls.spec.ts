import { RouteUrls } from './route-urls';

const isArrayUnique = (arr: string[]) => Array.isArray(arr) && new Set(arr).size === arr.length;

describe('RouteUrls', () => {
  it('has all unique route paths', () => {
    // Filter out the index routes bc the Container/Home will be duplicates
    const paths = Object.values(RouteUrls).filter(url => url !== '/');
    expect(isArrayUnique(paths)).toBeTruthy();
  });
});
