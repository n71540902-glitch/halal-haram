
import { GoogleGenAI, Type } from "@google/genai";
import { HalalStatus, Product } from "../types.ts";

const productSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    brand: { type: Type.STRING },
    status: { type: Type.STRING, enum: Object.values(HalalStatus) },
    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    explanation: { type: Type.STRING },
    religiousReference: { type: Type.STRING },
    category: { type: Type.STRING }
  },
  required: ["name", "brand", "status", "ingredients", "explanation", "category"]
};

const parseAIResponse = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON Parsing failed", e);
    return null;
  }
};

export const analyzeProductWithAI = async (productName: string): Promise<Partial<Product> | null> => {
  try {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) throw new Error("API Key missing");
    
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Вы — эксперт по халяль-продукции. Проанализируй "${productName}". 
      Дай ответ в формате JSON. Если это E-добавка, объясни происхождение. 
      Укажи статус (HALAL, HARAM, MUSHBOOH).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: productSchema
      }
    });

    const data = parseAIResponse(response.text || "");
    if (data) {
      return {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(productName)}/400/300`
      };
    }
    return null;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return null;
  }
};

export const analyzeProductImage = async (base64Image: string): Promise<Partial<Product> | null> => {
  try {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) throw new Error("API Key missing");

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: "Определи продукт на фото и его халяль статус. Ответь только в формате JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: productSchema
      }
    });

    const data = parseAIResponse(response.text || "");
    if (data) {
      return {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: `data:image/jpeg;base64,${base64Image}`
      };
    }
    return null;
  } catch (error) {
    console.error("Image Scan Error:", error);
    return null;
  }
};
