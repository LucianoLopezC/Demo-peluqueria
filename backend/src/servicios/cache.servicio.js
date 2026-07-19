const redis = require('../configuracion/redis');

const TTL_DISPONIBILIDAD_SEGUNDOS = 60;

function aClaveFecha(fecha) {
  return fecha.toISOString().slice(0, 10);
}

// servicioId es parte de la clave porque la duración del intervalo (y por lo
// tanto el conjunto de horas que calzan) difiere por servicio, no solo por
// profesional/día.
function claveDisponibilidad(profesionalId, servicioId, fecha) {
  return `disp:${profesionalId}:${servicioId}:${aClaveFecha(fecha)}`;
}

async function obtenerDisponibilidadCache(profesionalId, servicioId, fecha) {
  try {
    const enCache = await redis.get(claveDisponibilidad(profesionalId, servicioId, fecha));
    if (!enCache) return null;
    const intervalosIso = typeof enCache === 'string' ? JSON.parse(enCache) : enCache;
    return intervalosIso.map((iso) => new Date(iso));
  } catch (err) {
    console.error('Falló la lectura del cache de Redis, se recalcula directo', err.message);
    return null;
  }
}

async function guardarDisponibilidadCache(profesionalId, servicioId, fecha, intervalos) {
  try {
    const intervalosIso = intervalos.map((intervalo) => intervalo.toISOString());
    await redis.set(
      claveDisponibilidad(profesionalId, servicioId, fecha),
      JSON.stringify(intervalosIso),
      { ex: TTL_DISPONIBILIDAD_SEGUNDOS },
    );
  } catch (err) {
    console.error('Falló la escritura del cache de Redis', err.message);
  }
}

async function invalidarDisponibilidad(profesionalId, servicioId, fecha) {
  try {
    await redis.del(claveDisponibilidad(profesionalId, servicioId, fecha));
  } catch (err) {
    console.error('Falló la invalidación del cache de Redis', err.message);
  }
}

module.exports = {
  obtenerDisponibilidadCache,
  guardarDisponibilidadCache,
  invalidarDisponibilidad,
};
