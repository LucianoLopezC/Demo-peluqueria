const sanearHtml = require('sanitize-html');

// Elimina todas las etiquetas/atributos HTML de campos de texto libre (ej.
// notas, nombres) antes de que lleguen a la base de datos, como defensa en
// profundidad contra XSS almacenado, aunque React ya escapa el texto al renderizar.
const OPCIONES_ESTRICTAS = { allowedTags: [], allowedAttributes: {} };

function obtenerPorRuta(obj, ruta) {
  return ruta.split('.').reduce((acc, clave) => (acc == null ? acc : acc[clave]), obj);
}

function establecerPorRuta(obj, ruta, valor) {
  const claves = ruta.split('.');
  const ultimaClave = claves.pop();
  const objetivo = claves.reduce((acc, clave) => (acc == null ? acc : acc[clave]), obj);
  if (objetivo != null) objetivo[ultimaClave] = valor;
}

function sanitizarCampos(rutasCampos) {
  return (req, res, next) => {
    for (const ruta of rutasCampos) {
      const valor = obtenerPorRuta(req.body, ruta);
      if (typeof valor === 'string') {
        establecerPorRuta(req.body, ruta, sanearHtml(valor, OPCIONES_ESTRICTAS).trim());
      }
    }
    next();
  };
}

module.exports = sanitizarCampos;
