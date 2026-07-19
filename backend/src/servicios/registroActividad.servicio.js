const { obtenerBd } = require('../configuracion/mongo');

// Registro de auditoría/notificaciones "fire-and-forget": los fallos acá
// nunca deben romper el flujo principal, por eso cada error se captura y se
// loguea, nunca se relanza.

async function registrarNotificacion({
  reservaId,
  clienteId,
  profesionalId,
  tipo,
  canal,
  estado,
  datos,
}) {
  try {
    const bd = await obtenerBd();
    await bd.collection('notificaciones').insertOne({
      reservaId,
      clienteId,
      profesionalId,
      tipo,
      canal,
      estado,
      datos,
      enviadoEn: new Date(),
    });
  } catch (err) {
    console.error('No se pudo registrar la notificación', err.message);
  }
}

async function registrarActividad({ actorId, rolActor, accion, objetivoId, metadatos }) {
  try {
    const bd = await obtenerBd();
    await bd.collection('registrosActividad').insertOne({
      actorId,
      rolActor,
      accion,
      objetivoId,
      metadatos,
      creadoEn: new Date(),
    });
  } catch (err) {
    console.error('No se pudo registrar la actividad', err.message);
  }
}

module.exports = { registrarNotificacion, registrarActividad };
