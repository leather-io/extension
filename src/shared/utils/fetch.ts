import { X_API_KEY } from '@shared/constants';
import { createApiKeyMiddleware, createFetchFn } from '@stacks/network';

const apiMiddleware = createApiKeyMiddleware({ apiKey: X_API_KEY });
export const fetchPrivate = createFetchFn(apiMiddleware);
