import SeccionMarmol from '../comunes/SeccionMarmol';

const ESTADISTICAS = [
  { valor: '100%', etiqueta: 'Personalizado' },
  { valor: '1:1', etiqueta: 'Atención' },
  { valor: '30–90′', etiqueta: 'Por sesión' },
];

function QuienesSomos() {
  return (
    <SeccionMarmol id="nosotros" fondo="blanco">
      <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="arco bg-marble-200 flex h-[360px] items-center justify-center overflow-hidden border border-ink/10 md:h-[440px]">
          <span className="font-display text-sm tracking-[0.3em] text-marble-500 uppercase">
            Interior del estudio
          </span>
        </div>

        <div>
          <p className="font-display text-sm tracking-[0.4em] text-marble-500 uppercase">
            Quiénes somos
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight font-normal text-balance text-ink md:text-5xl">
            Una casa dedicada al oficio
          </h2>
          <p className="mt-6 font-sans font-light text-marble-700 md:text-lg">
            Peluquería 1 nace de la convicción de que cortar el cabello es, ante todo, un oficio de
            precisión. Trabajamos con cita previa y sin apuro: cada visita es un ritual de cuidado,
            no un trámite.
          </p>

          <div className="mt-11 grid grid-cols-3 gap-6 border-t border-ink/10 pt-8">
            {ESTADISTICAS.map((estadistica) => (
              <div key={estadistica.etiqueta}>
                <div className="font-display text-3xl text-ink">{estadistica.valor}</div>
                <div className="mt-1.5 font-sans text-xs tracking-greek text-marble-500 uppercase">
                  {estadistica.etiqueta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SeccionMarmol>
  );
}

export default QuienesSomos;
