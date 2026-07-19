const { z } = require('zod');

const esquemaCrearReserva = z.object({
  body: z.object({
    profesionalId: z.string().uuid(),
    servicioId: z.string().uuid(),
    horaInicio: z.string().min(1),
    notas: z.string().max(500).optional(),
    cliente: z.object({
      nombreCompleto: z.string().min(1).max(120),
      telefono: z.string().min(6).max(30),
      correo: z.string().email().optional(),
    }),
  }),
});

const esquemaReprogramarReserva = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    nuevaHoraInicio: z.string().min(1),
  }),
});

const esquemaCancelarReserva = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports = { esquemaCrearReserva, esquemaReprogramarReserva, esquemaCancelarReserva };
