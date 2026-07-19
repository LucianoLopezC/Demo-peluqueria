import Boton from '../comunes/Boton';

function Portada() {
  const desplazarAReserva = () => {
    document.getElementById('reservar')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-marble bg-grano relative overflow-hidden px-6 py-24 md:px-16 lg:px-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-[-40px] select-none font-display text-[560px] leading-none text-ink/[0.045]"
      >
        Π
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <div className="flex items-center gap-4 font-sans text-xs tracking-greek text-marble-500 uppercase">
            <span className="h-px w-10 bg-marble-500" />
            Estudio privado · Cortes y estilismo
          </div>
          <h1 className="mt-7 font-display text-5xl leading-[1.05] font-normal text-balance text-ink md:text-7xl">
            El arte del corte,
            <br />
            una tradición renovada
          </h1>
          <p className="mt-7 max-w-md font-sans font-light text-marble-700">
            Un espacio pensado para el detalle: cortes, color y estilismo con una mirada
            contemporánea sobre la elegancia clásica.
          </p>
          <div className="mt-11 flex flex-wrap items-center gap-5">
            <Boton onClick={desplazarAReserva}>Reservar hora</Boton>
            <a
              href="#servicios"
              className="border-b border-ink pb-1 font-sans text-xs tracking-greek text-ink uppercase"
            >
              Ver servicios
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="arco-lg bg-marble-200 relative flex h-[420px] items-center justify-center overflow-hidden border border-ink/10 md:h-[560px]">
            <span className="font-display text-sm tracking-[0.3em] text-marble-500 uppercase">
              Foto del estudio
            </span>
          </div>
          <div className="bg-marble-50 absolute -bottom-px left-1/2 -translate-x-1/2 px-7 pt-3 font-display text-xs tracking-[0.4em] text-marble-700">
            EST · MMXXVI
          </div>
        </div>
      </div>
    </section>
  );
}

export default Portada;
