import { useState, useCallback } from 'react';

interface FetchState<DataType> {
  data: DataType | null;
  isLoading: boolean;
  errorMessage: string | null;
}

interface FetchResult<DataType> extends FetchState<DataType> {
  execute: () => Promise<void>;
  reset: () => void;
}

export function useApiFetch<DataType>(
  fetchFunction: () => Promise<Entity.ApiResponse<DataType>>
): FetchResult<DataType> {
  const [fetchState, setFetchState] = useState<FetchState<DataType>>({
    data: null,
    isLoading: false,
    errorMessage: null,
  });

  const execute = useCallback(async () => {
    setFetchState({ data: null, isLoading: true, errorMessage: null });
    try {
      const response = await fetchFunction();
      if (response.success) {
        setFetchState({ data: response.data, isLoading: false, errorMessage: null });
      } else {
        setFetchState({ data: null, isLoading: false, errorMessage: response.error });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setFetchState({ data: null, isLoading: false, errorMessage });
    }
  }, [fetchFunction]);

  const reset = useCallback(() => {
    setFetchState({ data: null, isLoading: false, errorMessage: null });
  }, []);

  return { ...fetchState, execute, reset };
}
