import fs from 'node:fs/promises';
import { renderPages } from './.build/render.js';

const manifest = JSON.parse(await fs.readFile(new URL('./rendered/.vite/manifest.json', import.meta.url)));
const client = manifest['client.js'];
const assets = `${(client.css ?? []).map(file => `<link rel="stylesheet" href="/${file}">`).join('')}<script type="module" src="/${client.file}"></script>`;

for (const { route, head, body } of renderPages()) {
  const directory = new URL(`./rendered${route}/`, import.meta.url);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(new URL('index.html', directory), `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${head}${assets}</head><body>${body}</body></html>\n`);
  console.log(`Rendered ${route}`);
}
