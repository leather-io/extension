export type FetchState<T> =
  | {
      state: 'loading';
    }
  | {
      state: 'success';
      value: T;
    }
  | {
      state: 'error';
      errorMessage: string;
    };

export function toFetchState<T>({
  data,
  isLoading,
  isError,
  error,
}: {
  data?: T;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}) {
  if (isLoading) {
    return { state: 'loading' } as const;
  }
  if (isError) {
    return {
      state: 'error',
      errorMessage: error?.message ?? '',
    } as const;
  }
  if (!data) {
    return {
      state: 'error',
      errorMessage: '',
    } as const;
  }
  return {
    state: 'success',
    value: data,
  } as const;
}
