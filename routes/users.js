const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authMiddleware = require('../middlewares/auth');

// GET /users - listar todos los usuarios
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido o no proporcionado
 *       500:
 *         description: Error interno al obtener usuarios
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ status: 'success', data: users });
  } catch (err) {
    console.error('Error al listar usuarios:', err);
    res.status(500).json({ status: 'error', message: 'Error al obtener usuarios' });
  }
});

// GET /users/:id - obtener usuario por ID
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
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
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno al obtener usuario
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });
    res.json({ status: 'success', data: user });
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).json({ status: 'error', message: 'Error al obtener usuario' });
  }
});

// PUT /users/:id - actualizar usuario
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreCompleto:
 *                 type: string
 *                 example: Daniel Actualizado
 *               email:
 *                 type: string
 *                 example: actualizado@example.com
 *     responses:
 *       200:
 *         description: Usuario actualizado
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
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno al actualizar usuario
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nombreCompleto, email } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });

    user.nombreCompleto = nombreCompleto || user.nombreCompleto;
    user.email = email || user.email;
    await user.save();

    res.json({ status: 'success', data: user });
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ status: 'error', message: 'Error al actualizar usuario' });
  }
});

// DELETE /users/:id - eliminar usuario
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno al eliminar usuario
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });

    await user.destroy();
    res.json({ status: 'success', message: 'Usuario eliminado' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ status: 'error', message: 'Error al eliminar usuario' });
  }
});

module.exports = router;
