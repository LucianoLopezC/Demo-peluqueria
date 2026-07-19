const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const entorno = require('./configuracion/entorno');
const rutas = require('./rutas/indice');
const manejadorErrores = require('./intermediarios/manejadorErrores');
const { limitadorGeneral } = require('./intermediarios/limitadorSolicitudes');

const app = express();

// Esta app solo sirve JSON a una SPA separada (nunca HTML/scripts inline),
// así que el CSP puede ser lo más estricto posible; el CORP es explícitamente
// 'cross-origin' porque el frontend corre intencionalmente en otro origen.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    referrerPolicy: { policy: 'no-referrer' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: entorno.ORIGEN_CORS,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  }),
);

app.get('/health', (req, res) => res.json({ estado: 'ok' }));

app.use('/api', limitadorGeneral, rutas);

app.use(manejadorErrores);

module.exports = app;
