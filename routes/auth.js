// POST /auth/register

const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const router = express.Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreCompleto
 *               - email
 *               - password
 *             properties:
 *               nombreCompleto:
 *                 type: string
 *                 example: Daniel Pérez
 *               email:
 *                 type: string
 *                 example: daniel@example.com
 *               password:
 *                 type: string
 *                 example: ClaveSegura456
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Email ya registrado
 *       500:
 *         description: Error interno en el registro
 */
router.post('/register', async (req, res) => {
  const { nombreCompleto, email, password } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ status: 'fail', data: { message: 'Email ya registrado' } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ nombreCompleto, email, password: hashedPassword });
    console.log('Usuario creado:', user);

    res.status(201).json({
      status: 'success',
      data: {
        id: user.id,
        nombreCompleto: user.nombreCompleto,
        email: user.email
      }
    });
} catch (err) {
  console.error('Error en el registro:', err);
  res.status(500).json({ status: 'error', message: 'Error en el registro' });
}

});

// POST /auth/login

const jwt = require('jsonwebtoken');
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: daniel@example.com
 *               password:
 *                 type: string
 *                 example: ClaveSegura456
 *     responses:
 *       200:
 *         description: Login exitoso con token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Email y contraseña requeridos
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno al iniciar sesión
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'fail', data: { message: 'Email y contraseña requeridos' } });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ status: 'fail', data: { message: 'Credenciales inválidas' } });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ status: 'fail', data: { message: 'Credenciales inválidas' } });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.status(200).json({ status: 'success', data: { token } });
  } catch (err) {
    console.error('Error en /login:', err);
    res.status(500).json({ status: 'error', message: 'Error al iniciar sesión' });
  }
});


// GET /auth/me

const authMiddleware = require('../middlewares/auth');
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener datos del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido o no proporcionado
 *       500:
 *         description: Error interno al obtener usuario
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ status: 'success', data: user });
  } catch (err) {
    console.error('Error en /me:', err);
    res.status(500).json({ status: 'error', message: 'Error al obtener usuario' });
  }
});

module.exports = router;