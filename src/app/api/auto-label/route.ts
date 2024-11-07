import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ApiError } from '@/types/api';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const images = Array.from(formData.getAll('images')).filter(
      (item): item is File => item instanceof File
    );
    const prompt = formData.get('prompt');
    const startIndex = Number(formData.get('startIndex')) || 0;
    const totalImages = Number(formData.get('totalImages')) || images.length; // Aggiungiamo questo

    if (images.length === 0) {
      const error: ApiError = {
        code: 'VALIDATION_ERROR',
        message: 'Nessuna immagine valida fornita'
      };
      return NextResponse.json({ success: false, error }, { status: 400 });
    }
    const apiKey = formData.get('apiKey') as string;
    console.log('formData',formData)
    try {
      const openai = new OpenAI({ apiKey });
      // Fai una chiamata di test leggera per verificare l'API key
      await openai.models.list();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const apiError: ApiError = {
        code: 'INVALID_API_KEY',
        message: 'API Key non valida. Verifica la tua API key nelle impostazioni.'
      };
      return NextResponse.json({ success: false, error: apiError }, { status: 401 });
    }
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'API_KEY_MISSING',
            message: 'API Key non fornita' 
          } 
        }, 
        { status: 400 }
      );
    }

    //const apiKey = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({ apiKey });
    
    const results: { [key: string]: string | null } = {};

    for (const image of images) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt as string },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${image.type};base64,${base64}`,
                  },
                },
              ],
            },
          ],
        });
        

        //await delay(Math.random() * 1000 );
        results[image.name] = completion.choices[0].message.content;
        //results[image.name] = Math.random() < 0.5 ? "1" : "2";
      } catch (error) {
        console.error(`Error processing image ${image.name}:`, error);
        results[image.name] = null;
      }
    }
    
    const processedImages = startIndex + images.length;
    const isComplete = processedImages >= totalImages;

    return NextResponse.json({
      results,  // Solo i risultati effettivi
      progress: {
        processedImages: startIndex + images.length,
        totalImages: images.length,
        isComplete
      },
      nextBatchIndex: startIndex + images.length
    });

  } catch (error) {
    console.error('Error in auto-label:', error);
    return NextResponse.json(
      { error: 'Failed to process images' },
      { status: 500 }
    );
  }
}

