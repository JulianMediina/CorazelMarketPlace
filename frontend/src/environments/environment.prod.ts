// Valor por defecto en el repo. En el deploy real, `npm run build:prod` (ver
// scripts/set-env.js y DEPLOYMENT.md) sobreescribe este archivo con las variables de
// entorno API_URL / WHATSAPP_SALES_NUMBER definidas en Vercel — no editar a mano.
export const environment = {
  production: true,
  apiUrl: 'https://REEMPLAZAR-CON-TU-BACKEND.onrender.com/api',
  whatsappSalesNumber: '000000000000',
};
