const { z } = require('zod');

const REGEX_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

const esquemaDia = z
  .object({
    diaSemana: z.number().int().min(0).max(6),
    horaInicio: z.string().regex(REGEX_HORA, 'Se espera HH:mm'),
    horaFin: z.string().regex(REGEX_HORA, 'Se espera HH:mm'),
    inicioDescanso: z.string().regex(REGEX_HORA, 'Se espera HH:mm').nullable().optional(),
    finDescanso: z.string().regex(REGEX_HORA, 'Se espera HH:mm').nullable().optional(),
    activo: z.boolean(),
  })
  .refine((dia) => dia.horaInicio < dia.horaFin, {
    message: 'horaInicio debe ser antes de horaFin',
    path: ['horaFin'],
  });

const esquemaActualizarHorarioLaboral = z.object({
  body: z.object({
    dias: z.array(esquemaDia).min(1).max(7),
  }),
});

module.exports = { esquemaActualizarHorarioLaboral };
