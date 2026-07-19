const FONDOS = {
  crema: 'bg-marble',
  blanco: 'bg-marble-100',
  oscuro: 'bg-ink text-marble-50',
};

function SeccionMarmol({ id, fondo = 'crema', className = '', children }) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden px-6 py-section md:px-16 lg:px-24 ${FONDOS[fondo]} ${className}`}
    >
      <div className="relative mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export default SeccionMarmol;
