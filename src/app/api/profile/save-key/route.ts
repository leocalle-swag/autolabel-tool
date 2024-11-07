import { NextResponse } from 'next/server';
import type { ApiResponse, ApiError } from '@/types/api';


interface SaveKeyResponse {
  saved: boolean;
}

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<SaveKeyResponse>>> {
  try {
    const body = await request.json();
    
    if (!(body)) {
      const error: ApiError = {
        code: 'VALIDATION_ERROR',
        message: 'API Key non valida o mancante'
      };
      return NextResponse.json({ success: false, error }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      data: { saved: true }
    });
  } catch (err) {
    const error: ApiError = {
      code: 'INTERNAL_ERROR',
      message: err instanceof Error ? err.message : 'Errore nel salvataggio API key',
      details: err
    };

    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}
