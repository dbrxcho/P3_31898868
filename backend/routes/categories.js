const express = require('express');
const router = express.Router();
const { Category } = require('../models');

/**
 * @swagger
 * tags:
 *   - name: Admin - Categories
 *     description: Endpoints protegidos para la gestión de categorías
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Admin - Categories]
 *     security: [{ bearerAuth: [] }]
 *     summary: Crear una categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Rock"
 *               description:
 *                 type: string
 *                 example: "Vinilos de rock clásico"
 *     responses:
 *       201:
 *         description: Categoría creada
 */
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ status: 'fail', data: { message: 'El nombre es obligatorio' } });
    }
    const category = await Category.create({ name, description });
    res.status(201).json({ status: 'success', data: category });
  } catch (err) {
    console.error('CREATE CATEGORY ERROR:', err);
    res.status(400).json({ status: 'fail', data: { message: err.message } });
  }
});

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Admin - Categories]
 *     security: [{ bearerAuth: [] }]
 *     summary: Listar todas las categorías
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({ status: 'success', data: categories });
  } catch (err) {
    console.error('GET CATEGORIES ERROR:', err);
    res.status(400).json({ status: 'fail', data: { message: err.message } });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Admin - Categories]
 *     security: [{ bearerAuth: [] }]
 *     summary: Obtener una categoría por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 */
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ status: 'fail', data: { message: 'Categoría no encontrada' } });
    }
    res.status(200).json({ status: 'success', data: category });
  } catch (err) {
    console.error('GET CATEGORY ERROR:', err);
    res.status(400).json({ status: 'fail', data: { message: err.message } });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags: [Admin - Categories]
 *     security: [{ bearerAuth: [] }]
 *     summary: Actualizar una categoría por ID
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       404:
 *         description: Categoría no encontrada
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ status: 'fail', data: { message: 'Categoría no encontrada' } });
    }
    await category.update({ name, description });
    res.status(200).json({ status: 'success', data: category });
  } catch (err) {
    console.error('UPDATE CATEGORY ERROR:', err);
    res.status(400).json({ status: 'fail', data: { message: err.message } });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags: [Admin - Categories]
 *     security: [{ bearerAuth: [] }]
 *     summary: Eliminar una categoría por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 */
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ status: 'fail', data: { message: 'Categoría no encontrada' } });
    }
    await category.destroy();
    res.status(200).json({ status: 'success', data: { message: 'Categoría eliminada' } });
  } catch (err) {
    console.error('DELETE CATEGORY ERROR:', err);
    res.status(400).json({ status: 'fail', data: { message: err.message } });
  }
});

module.exports = router;
