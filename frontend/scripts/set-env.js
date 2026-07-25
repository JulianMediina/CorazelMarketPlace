// Genera src/environments/environment.prod.ts a partir de variables de entorno del
// proveedor de hosting (Vercel), para que un deploy nunca requiera editar código a mano.
// Se corre como paso previo al build de producción — ver package.json ("build:prod") y
// frontend/vercel.json.
const { writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

const REQUIRED_VARS = ['API_URL', 'WHATSAPP_SALES_NUMBER'];
const missing = REQUIRED_VARS.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(
    `[set-env] Faltan variables de entorno requeridas: ${missing.join(', ')}.\n` +
      '[set-env] Defínelas en el dashboard de Vercel (Project Settings > Environment Variables) — ver DEPLOYMENT.md.',
  );
  process.exit(1);
}

const target = resolve(__dirname, '../src/environments/environment.prod.ts');

const content = `// Archivo generado automáticamente por scripts/set-env.js a partir de variables de
// entorno en tiempo de build (ver DEPLOYMENT.md). No editar a mano: se sobreescribe en
// cada deploy.
export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL}',
  whatsappSalesNumber: '${process.env.WHATSAPP_SALES_NUMBER}',
};
`;

writeFileSync(target, content);
console.log(`[set-env] environment.prod.ts generado (apiUrl=${process.env.API_URL}).`);
