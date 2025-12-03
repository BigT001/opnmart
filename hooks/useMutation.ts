import {
  useMutation as useReactMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { AxiosError } from 'axios';

interface UseMutationProps<T, U> extends Omit<UseMutationOptions<T, AxiosError, U>, 'mutationFn'> {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export function useMutation<T, U>({
  url,
  method = 'POST',
  ...options
}: UseMutationProps<T, U>): UseMutationResult<T, AxiosError, U> {
  return useReactMutation<T, AxiosError, U>({
    mutationFn: async (data: U) => {
      let response;
      switch (method) {
        case 'POST':
          response = await apiClient.post<T>(url, data);
          break;
        case 'PUT':
          response = await apiClient.put<T>(url, data);
          break;
        case 'PATCH':
          response = await apiClient.patch<T>(url, data);
          break;
        case 'DELETE':
          response = await apiClient.delete<T>(url);
          break;
        default:
          response = await apiClient.post<T>(url, data);
      }
      return response.data;
    },
    ...options,
  });
}
