const { z } = require('zod');

const esquemaInicioSesion = z.object({
  body: z.object({
    correo: z.string().email(),
    contrasena: z.string().min(1),
  }),
});

module.exports = { esquemaInicioSesion };
