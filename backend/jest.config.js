module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  // La dependencia htmlparser2 de sanitize-html es ESM puro y el runtime CJS
  // de Jest no puede requerirla (Node en sí no tiene problema) — se simula solo para los tests.
  moduleNameMapper: {
    '^sanitize-html$': '<rootDir>/tests/simulaciones/sanitizarHtml.simulacion.js',
  },
};
