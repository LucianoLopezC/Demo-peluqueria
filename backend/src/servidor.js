const app = require('./aplicacion');
const entorno = require('./configuracion/entorno');

const servidor = app.listen(entorno.PUERTO, () => {
  console.log(`Backend escuchando en el puerto ${entorno.PUERTO}`);
});

process.on('SIGTERM', () => {
  servidor.close(() => process.exit(0));
});
