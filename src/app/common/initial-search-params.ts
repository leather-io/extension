export const initialSearchParams = new URLSearchParams(window.location.href.split('?')[1]);

export const flow = initialSearchParams.get('flow');
export const origin = initialSearchParams.get('origin');
