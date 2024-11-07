// src/app/api/profile/get-key/route.ts
import { NextResponse } from 'next/server';
import type { ApiError, ApiResponse } from '@/types/api';

interface GetKeyResponse {
  apiKey: string | null;
}

export async function GET(): Promise<NextResponse<ApiResponse<GetKeyResponse>>> {
  try {
    // Qui implementeremo il recupero da database
    return NextResponse.json({
      success: true,
      data: { apiKey: null }
    });
  } catch (err) {
    const error: ApiError = {
      code: 'INTERNAL_ERROR',
      message: err instanceof Error ? err.message : 'Errore nel recupero API key',
      details: err
    };

    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}