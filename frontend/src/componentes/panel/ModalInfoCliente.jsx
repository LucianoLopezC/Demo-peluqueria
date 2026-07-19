function ModalInfoCliente({ reserva, onCerrar }) {
  if (!reserva) return null;

  const { cliente, servicio, horaInicio, notas } = reserva;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/40 px-6">
      <div className="w-full max-w-md border border-marble-300 bg-marble-50 p-8">
        <p className="font-accent text-xs tracking-greek text-marble-500 uppercase">Cliente</p>
        <h2 className="mt-2 font-display text-2xl text-ink">{cliente.nombreCompleto}</h2>

        <dl className="mt-6 grid gap-3 font-sans text-sm text-marble-700">
          <div>
            <dt className="text-marble-400">Teléfono</dt>
            <dd>{cliente.telefono}</dd>
          </div>
          {cliente.correo && (
            <div>
              <dt className="text-marble-400">Email</dt>
              <dd>{cliente.correo}</dd>
            </div>
          )}
          <div>
            <dt className="text-marble-400">Servicio</dt>
            <dd>{servicio.nombre}</dd>
          </div>
          <div>
            <dt className="text-marble-400">Hora</dt>
            <dd>{new Date(horaInicio).toLocaleString('es-CL')}</dd>
          </div>
          {notas && (
            <div>
              <dt className="text-marble-400">Notas</dt>
              <dd>{notas}</dd>
            </div>
          )}
        </dl>

        <button
          type="button"
          onClick={onCerrar}
          className="mt-8 w-full border border-ink py-3 font-sans text-xs tracking-greek text-ink uppercase hover:bg-ink hover:text-marble-50"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ModalInfoCliente;
