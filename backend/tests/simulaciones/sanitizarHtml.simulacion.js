// La dependencia htmlparser2 de sanitize-html es ESM puro, que el runtime
// CommonJS de Jest no puede requerir (Node en sí no tiene problema, así que la
// app real no se ve afectada — esta simulación solo existe para el entorno de Jest).
// Emula nuestro único patrón de uso (allowedTags: [] -> elimina cada etiqueta).
module.exports = function sanearHtml(input) {
  return String(input)
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]*>/g, '');
};
