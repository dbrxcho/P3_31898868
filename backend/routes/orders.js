const express = require('express');
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/orderController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestión de órdenes y checkout
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Creación de orden y proceso de pago (Transaccional)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, paymentMethod, paymentDetails]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: integer, example: 1 }
 *                     quantity: { type: integer, example: 2 }
 *               paymentMethod:
 *                 type: string
 *                 example: CreditCard
 *               paymentDetails:
 *                 type: object
 *                 properties:
 *                   cardToken: { type: string, example: "tok_abc123" }
 *                   currency: { type: string, example: "USD" }
 *     responses:
 *       201:
 *         description: Orden creada exitosamente (transacción confirmada)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: "success" }
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Error de validación o stock insuficiente (rollback)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: "fail" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     message: { type: string, example: "Stock insuficiente" }
 *       402:
 *         description: Pago rechazado (rollback completo)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: "fail" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     message: { type: string, example: "Pago rechazado" }
 *       401:
 *         description: No autenticado
 */
router.post('/', auth, ctrl.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Historial de órdenes del usuario autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *     responses:
 *       200:
 *         description: Lista de órdenes
 */
router.get('/', auth, ctrl.listOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Detalle de una orden propia
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Orden encontrada
 *       404:
 *         description: Orden no encontrada o no pertenece al usuario
 */
router.get('/:id', auth, ctrl.getOrderById);

module.exports = router;
