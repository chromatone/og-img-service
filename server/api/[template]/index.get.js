// server/api/og-image.ts
import { ImageResponse, html, } from 'og-img'

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fetchFont(fontPath) {
  try {
    const fontBuffer = await fs.readFile(join(__dirname, fontPath));
    return fontBuffer;
  } catch (error) {
    console.error('Error reading font file:', error);
    throw error;
  }
}

let font

async function preloadFont() {
  if (!font) {
    console.log('Loading font...')
    font = await fetchFont(`../../public/fonts/Commissioner-Regular.ttf`)
  }

  return font
}


export default defineEventHandler(async (event) => {

  const { text = 'hello' } = getQuery(event)

  const templates = {
    center: html`
      <div class="flex bg-gray-100 items-center h-full p-8">
        <img width="300" class="p-4" src="https://chromatone.center/media/logo/click-logo.png" />
        <div class="flex flex-col px-2">
          <div class="flex text-120px font-bold">
          Chromatone
          </div> 
          <div class="flex text-80px">
          ${text}
          </div>
        </div>
      </div>
    `,
    simple: html`
      <div class="flex flex-col items-center p-8">
       
        <div class="flex text-5xl p-4">
        Chromatone
        </div>
        <div class="flex text-2xl p-4">
        ${text}
        </div>
      </div>
    `
  }

  const { template = 'center' } = event.context.params

  const imageResponse = await new ImageResponse(
    templates[template] || templates.center,
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: 'Commissioner',
          data: await fetchFont(`../../public/fonts/Commissioner-Regular.ttf`),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Commissioner',
          data: await fetchFont(`../../public/fonts/Commissioner-Bold.ttf`),
          weight: 800,
          style: 'bold',
        },
      ],
    }
  )

  setHeader(event, 'Content-Type', 'image/png')

  return imageResponse
}
)