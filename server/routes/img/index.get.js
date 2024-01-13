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

export default defineEventHandler(async (req) => {

  const { text = 'hello' } = getQuery(req)

  const imageResponse = await new ImageResponse(
    html`
      <div class="flex items-center p-8">
        <img width="400" src="https://chromatone.center/media/logo/click-logo.png" />
        <div class="flex text-2xl p-4">
        Chromatone
        </div> 
        <div class="flex text-2xl p-4">
        ${text}
        </div>
      </div>
    `,
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: 'Commissioner',
          data: await preloadFont(),
          weight: 400,
          style: 'normal',
        },
      ],
    }
  )

  setHeader(req, 'Content-Type', 'image/png')

  return imageResponse
}
)