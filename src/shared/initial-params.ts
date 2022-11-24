export const initialParams = new URLSearchParams(window.location.href.split('?')[1]);

export const flow = initialParams.get('flow');
export const referringAppDomain = initialParams.get('referringAppDomain');
