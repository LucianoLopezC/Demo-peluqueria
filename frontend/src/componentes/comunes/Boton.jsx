function Boton({ children, variant = 'filled', className = '', ...props }) {
  const base = 'px-10 py-4 font-sans text-xs tracking-greek uppercase transition-colors';
  const variantes = {
    outline: 'border border-ink text-ink hover:bg-ink hover:text-marble-50',
    filled: 'bg-ink text-marble-50 hover:bg-marble-900',
    claro: 'bg-marble-50 text-ink hover:bg-marble-200',
  };

  return (
    <button className={`${base} ${variantes[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Boton;
