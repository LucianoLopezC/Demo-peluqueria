function Antetitulo({ children }) {
  return (
    <p className="font-display text-sm tracking-[0.4em] text-marble-500 uppercase">{children}</p>
  );
}

function TituloSerif({ antetitulo, children, className = '', claro = false }) {
  return (
    <div className="mb-12 text-center">
      {antetitulo && <Antetitulo>{antetitulo}</Antetitulo>}
      <h2
        className={`mt-5 font-display text-4xl font-normal text-balance md:text-5xl ${claro ? 'text-marble-50' : 'text-ink'} ${className}`}
      >
        {children}
      </h2>
    </div>
  );
}

export default TituloSerif;
