const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'fail',
      data: { message: 'Token no proporcionado' }
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    // Buscar el usuario en la BD
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        data: { message: 'Usuario no encontrado' }
      });
    }

    req.user = user; // 👈 ahora es el objeto User completo
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      data: { message: 'Token inválido o expirado' }
    });
  }
};
