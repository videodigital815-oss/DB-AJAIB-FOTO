
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const generateImageFromTextAndImages = async (prompt: string, images: File[], count: number = 1): Promise<string[]> => {
    if (!process.env.API_KEY) {
        throw new Error("Variabel lingkungan API_KEY tidak diatur.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imageParts = await Promise.all(images.map(fileToGenerativePart));
    const textPart = { text: prompt };

    // Create an array of promises, one for each image generation request.
    const generationPromises: Promise<GenerateContentResponse>[] = [];
    for (let i = 0; i < count; i++) {
        generationPromises.push(
            ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [...imageParts, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE],
                    // candidateCount is not supported, so we make separate calls.
                },
            })
        );
    }

    // Await all promises to resolve in parallel.
    const responses = await Promise.all(generationPromises);

    const results: string[] = [];
    for (const response of responses) {
        if (response.candidates && response.candidates.length > 0) {
            // Each response will have one candidate for a single-image request.
            for (const candidate of response.candidates) {
                if (candidate.content && candidate.content.parts) {
                  for (const part of candidate.content.parts) {
                      if (part.inlineData) {
                          results.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
                      }
                  }
                }
            }
        }
    }
    
    if (results.length === 0) {
        throw new Error("AI tidak menghasilkan gambar. Silakan coba lagi.");
    }
    
    return results;
};