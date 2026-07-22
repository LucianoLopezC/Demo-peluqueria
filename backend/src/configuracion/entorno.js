const { z } = require('zod');
require('dotenv').config();

const esquemaEntorno = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PUERTO: z.coerce.number().default(4000),
  URL_BASE_DATOS: z.string().min(1, 'URL_BASE_DATOS es requerida'),
  SECRETO_TOKEN_ACCESO: z.string().min(1, 'SECRETO_TOKEN_ACCESO es requerido'),
  SECRETO_TOKEN_REFRESCO: z.string().min(1, 'SECRETO_TOKEN_REFRESCO es requerido'),
  ORIGEN_CORS: z.string().default('http://localhost:5173'),
  URL_REST_UPSTASH_REDIS: z.string().optional(),
  TOKEN_REST_UPSTASH_REDIS: z.string().optional(),
  URI_MONGODB: z.string().optional(),
  // Nombre exigido por Vercel Cron Jobs: si la variable se llama exactamente
  // así, Vercel la envía sola como "Authorization: Bearer <valor>" en cada
  // invocación programada, así que no se traduce (igual que NODE_ENV/VITE_).
  CRON_SECRET: z.string().optional(),
});

const analizado = esquemaEntorno.safeParse(process.env);

if (!analizado.success) {
  console.error('Variables de entorno inválidas:', analizado.error.flatten().fieldErrors);
  throw new Error('Variables de entorno inválidas');
}

module.exports = analizado.data;
