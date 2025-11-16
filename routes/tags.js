const express = require('express');
const router = express.Router();
const { Tag } = require('../models');

/**
 * @swagger
 * /tags:
 *   post:
 *     tags: [Admin - Tags]
 *     security: [{ bearerAuth: [] }]
 *     summary: Crear un tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       201:
 *         description: Tag creado
 *   get:
 *     tags: [Admin - Tags]
 *     security: [{ bearerAuth: [] }]
 *     summary: Listar todos los tags
 *     responses:
 *       200:
 *         description: Lista de tags
 */
router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json({ status: 'success', data: tag });
  } catch (err) {
    const message = err.name === 'SequelizeUniqueConstraintError' ? 'Tag name must be unique' : 'Error creating tag';
    res.status(400).json({ status: 'fail', data: { message } });
  }
});

/**
 * @swagger
 * /tags:
 *   get:
 *     tags: [Admin - Tags]
 *     summary: Listar todos los tags
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de tags
 */
router.get('/', async (req, res) => {
  const tags = await Tag.findAll();
  res.json({ status: 'success', data: tags });
});

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     tags: [Admin - Tags]
 *     summary: Obtener un tag por ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Tag encontrado
 *       404:
 *         description: Tag no encontrado
 */
router.get('/:id', async (req, res) => {
  const tag = await Tag.findByPk(req.params.id);
  if (!tag) return res.status(404).json({ status: 'fail', data: { message: 'Not found' } });
  res.json({ status: 'success', data: tag });
});

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     tags: [Admin - Tags]
 *     summary: Actualizar un tag por ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *     responses:
 *       200:
 *         description: Tag actualizado
 *       404:
 *         description: Tag no encontrado
 */
router.put('/:id', async (req, res) => {
  const tag = await Tag.findByPk(req.params.id);
  if (!tag) return res.status(404).json({ status: 'fail', data: { message: 'Not found' } });
  await tag.update(req.body);
  res.json({ status: 'success', data: tag });
});

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     tags: [Admin - Tags]
 *     summary: Eliminar un tag por ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Tag eliminado
 *       404:
 *         description: Tag no encontrado
 */
router.delete('/:id', async (req, res) => {
  const tag = await Tag.findByPk(req.params.id);
  if (!tag) return res.status(404).json({ status: 'fail', data: { message: 'Not found' } });
  await tag.destroy();
  res.json({ status: 'success', data: null });
});

module.exports = router;
