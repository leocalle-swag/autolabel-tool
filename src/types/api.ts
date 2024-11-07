// src/types/api.ts
export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
    success: boolean;
  }
  
  export interface ApiError {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  }
  
  export type ApiErrorCode = 
    | 'INVALID_REQUEST'
    | 'UNAUTHORIZED'
    | 'NOT_FOUND'
    | 'INTERNAL_ERROR'
    | 'VALIDATION_ERROR'
    | 'API_KEY_ERROR'
    | 'INVALID_API_KEY';