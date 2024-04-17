interface Asset {
  name: string;
  icon: string;
}

export function sortAssetsBySymbol(assets: Asset[]) {
  return assets
    .sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    })
    .sort((a, b) => {
      if (a.name === 'STX') return -1;
      if (b.name !== 'STX') return 1;
      return 0;
    })
    .sort((a, b) => {
      if (a.name === 'BTC') return -1;
      if (b.name !== 'BTC') return 1;
      return 0;
    });
}
