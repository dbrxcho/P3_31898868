const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const ProductRepository = require('../repositories/ProductRepository');
const ProductQueryBuilder = require('../services/ProductQueryBuilder');
const auth = require('../middlewares/auth');
const adminCtrl = require('../controllers/products.admin.controller');
const validateProduct = require('../middlewares/validateProduct.js');

console.log('typeof validateProduct:', typeof validateProduct);
console.log('validateProduct:', validateProduct);
console.log('adminCtrl:', adminCtrl);
console.log('auth:', auth);
console.log('auth:', auth);
console.log('validateProduct:', validateProduct);
console.log('adminCtrl.create:', adminCtrl.create);

/**
 * @swagger
 * tags:
 *   - name: Public - Products
 *     description: Endpoints públicos para consultar productos
 *   - name: Admin - Products
 *     description: Endpoints protegidos para la gestión de productos
 */

/**
 * @swagger
 * /public/products:
 *   get:
 *     tags: [Public - Products]
 *     summary: Listar productos con filtros y paginación
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: tags
 *         schema: { type: string }
 *       - in: query
 *         name: price_min
 *         schema: { type: number }
 *       - in: query
 *         name: price_max
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Lista de productos filtrada
 */
router.get('/', async (req, res) => {
  try {
    const qb = new ProductQueryBuilder()
      .setPagination(req.query.page, req.query.limit)
      .addSearch(req.query.search)
      .addPriceRange(req.query.price_min, req.query.price_max)
      .addCategory(req.query.category)
      .addTags(req.query.tags)
      .addCustomFilters(req.query);

    const query = qb.build();
    const { rows, count } = await ProductRepository.list(query);

    res.json({
      status: 'success',
      data: rows,
      meta: {
        total: count,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
  }
});

/**
 * @swagger
 * /p/{id}-{slug}:
 *   get:
 *     tags: [Public - Products]
 *     summary: Obtener producto por ID y slug
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       301:
 *         description: Redirección al slug correcto
 *       404:
 *         description: Producto no encontrado
 */
router.get('/p/:id-:slug', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ status: 'fail', data: { message: 'Not found' } });
  if (product.slug !== req.params.slug) {
    return res.status(301)
      .set('Location', `/p/${product.id}-${product.slug}`)
      .json({ status: 'fail', data: { message: 'Redirecting to canonical URL' } });
  }
  res.json({ status: 'success', data: product });
});

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Admin - Products]
 *     security: [{ bearerAuth: [] }]
 *     summary: Crear un producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - categoryId
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               sku: { type: string }
 *               artist: { type: string }
 *               album: { type: string }
 *               year: { type: integer }
 *               genre: { type: string }
 *               label: { type: string }
 *               format: { type: string }
 *               condition: { type: string }
 *               colorVariant: { type: string }
 *               categoryId: { type: integer }
 *               tagIds:
 *                 type: array
 *                 items: { type: integer }
 *     responses:
 *       201:
 *         description: Producto creado
 */
router.post('/', auth, validateProduct, adminCtrl.create);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Admin - Products]
 *     summary: Obtener un producto por ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', auth, adminCtrl.getById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: [Admin - Products]
 *     summary: Actualizar un producto por ID
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
 *               price: { type: number }
 *               stock: { type: integer }
 *               categoryId: { type: integer }
 *               tagIds:
 *                 type: array
 *                 items: { type: integer }
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', auth, validateProduct, adminCtrl.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Admin - Products]
 *     summary: Eliminar un producto por ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', auth, adminCtrl.remove);

// --- Ping ---
router.get('/ping', (req, res) => {
  res.status(200).json({ status: 'success', message: 'pong' });
});

module.exports = router;
