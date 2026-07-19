jest.mock('../../src/configuracion/redis', () => ({
  incr: jest.fn(),
  decr: jest.fn(),
  del: jest.fn(),
  pexpire: jest.fn(),
}));

const redis = require('../../src/configuracion/redis');
const { AlmacenLimiteUpstash } = require('../../src/intermediarios/limitadorSolicitudes');

describe('AlmacenLimiteUpstash', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('establece una expiración solo en el primer incremento de una clave', async () => {
    const almacen = new AlmacenLimiteUpstash();
    almacen.init({ windowMs: 60000 });

    redis.incr.mockResolvedValue(1);

    const resultado = await almacen.increment('alguna-clave');

    expect(resultado.totalHits).toBe(1);
    expect(redis.pexpire).toHaveBeenCalledWith('alguna-clave', 60000);
  });

  it('no reinicia la expiración en incrementos posteriores', async () => {
    const almacen = new AlmacenLimiteUpstash();
    almacen.init({ windowMs: 60000 });

    redis.incr.mockResolvedValue(4);

    const resultado = await almacen.increment('alguna-clave');

    expect(resultado.totalHits).toBe(4);
    expect(redis.pexpire).not.toHaveBeenCalled();
  });

  it('falla abierto (permite la request) cuando redis lanza un error', async () => {
    const almacen = new AlmacenLimiteUpstash();
    almacen.init({ windowMs: 60000 });

    redis.incr.mockRejectedValue(new Error('connection refused'));

    const resultado = await almacen.increment('alguna-clave');

    expect(resultado.totalHits).toBe(1);
  });

  it('resetKey elimina la clave de redis correspondiente', async () => {
    const almacen = new AlmacenLimiteUpstash();
    await almacen.resetKey('alguna-clave');
    expect(redis.del).toHaveBeenCalledWith('alguna-clave');
  });
});
