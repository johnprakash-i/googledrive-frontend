import { AxiosError } from 'axios'
export interface ApiErrorResponse {
  success: boolean
  message: string
  errorCode?: string
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  const err = error as AxiosError<ApiErrorResponse>
  return err.response?.data?.message || fallback
}