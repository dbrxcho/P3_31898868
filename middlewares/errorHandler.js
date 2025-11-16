module.exports = function errorHandler(err, req, res, next) {
  // Mapeo de errores comunes (Sequelize)
  if (err && err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ status: 'fail', data: { message: 'Registro duplicado' } });
  }
  if (err && err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ status: 'fail', data: { message: 'Relación inválida' } });
  }
  if (err && err.name === 'SequelizeValidationError') {
    return res.status(400).json({ status: 'fail', data: { message: err.errors?.[0]?.message || 'Validación inválida' } });
  }

  // Fallback genérico
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  if (status >= 500) {
    // En producción, no exponer detalles (ajusta según NODE_ENV)
    return res.status(status).json({ status: 'error', message });
  }
  return res.status(status).json({ status: 'fail', data: { message } });
};