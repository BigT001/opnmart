import {
  useQuery as useReactQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { AxiosError } from 'axios';

interface UseQueryProps<T> extends Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'> {
  key: string[];
  url: string;
}

export function useQuery<T>({
  key,
  url,
  ...options
}: UseQueryProps<T>): UseQueryResult<T, AxiosError> {
  return useReactQuery<T, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const response = await apiClient.get<T>(url);
      return response.data;
    },
    ...options,
  });
}
