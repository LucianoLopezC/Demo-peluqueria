const sanitizarCampos = require('../../src/intermediarios/sanitizar');

function ejecutarIntermediario(body, rutasCampos) {
  const req = { body };
  const next = jest.fn();
  sanitizarCampos(rutasCampos)(req, {}, next);
  expect(next).toHaveBeenCalledTimes(1);
  return req.body;
}

describe('intermediario sanitizarCampos', () => {
  it('elimina etiquetas <script> de un campo de primer nivel', () => {
    const body = ejecutarIntermediario({ notas: '<script>alert(1)</script>Hola' }, ['notas']);
    expect(body.notas).toBe('Hola');
  });

  it('elimina etiquetas y atributos HTML arbitrarios', () => {
    const body = ejecutarIntermediario({ notas: '<img src=x onerror=alert(1)>Cliente frecuente' }, [
      'notas',
    ]);
    expect(body.notas).toBe('Cliente frecuente');
    expect(body.notas).not.toMatch(/onerror/);
  });

  it('sanitiza campos anidados direccionados por ruta con punto', () => {
    const body = ejecutarIntermediario({ cliente: { nombreCompleto: '<b>Juan</b> Pérez' } }, [
      'cliente.nombreCompleto',
    ]);
    expect(body.cliente.nombreCompleto).toBe('Juan Pérez');
  });

  it('deja el texto plano sin modificar', () => {
    const body = ejecutarIntermediario({ notas: 'Cliente prefiere corte corto' }, ['notas']);
    expect(body.notas).toBe('Cliente prefiere corte corto');
  });

  it('no hace nada cuando el campo está ausente o no es un string', () => {
    const body = ejecutarIntermediario({ notas: undefined }, ['notas']);
    expect(body.notas).toBeUndefined();
  });
});
