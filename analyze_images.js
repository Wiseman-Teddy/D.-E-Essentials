import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeImages() {
  const imagesDir = 'C:\\Users\\1012 G2\\.gemini\\antigravity-ide\\brain\\1e6fb179-0185-4ee3-b562-0751ea219596';
  const images = [
    'media__1783169208415.png',
    'media__1783169234030.png',
    'media__1783169248432.png',
    'media__1783169259789.png',
    'media__1783169275213.png',
    'media__1783169518444.png',
    'media__1783169526627.png',
    'media__1783169536742.png',
    'media__1783169547854.png',
    'media__1783169559589.png',
    'media__1783169718279.png',
    'media__1783169727491.png'
  ];

  for (const file of images) {
    try {
      const filePath = path.join(imagesDir, file);
      const data = fs.readFileSync(filePath);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: "Extract all the product data from this image. What is the product name, price, stock quantity, and any other details?" },
              { inlineData: { data: data.toString("base64"), mimeType: "image/png" } }
            ]
          }
        ]
      });
      console.log(`--- Data from ${file} ---`);
      console.log(response.text);
    } catch(err) {
      console.error(`Error on ${file}:`, err.message);
    }
  }
}

analyzeImages();
