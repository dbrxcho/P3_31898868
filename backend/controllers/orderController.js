const OrderService = require('../services/OrderService');
const { Order, OrderItem, Product } = require('../models');
const service = new OrderService();

exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, paymentDetails } = req.body;

    // Validaciones iniciales
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'fail',
        data: { message: 'Items requeridos' }
      });
    }
    if (
      !paymentMethod ||
      !paymentDetails ||
      !paymentDetails.cardToken ||
      !paymentDetails.currency
    ) {
      return res.status(400).json({
        status: 'fail',
        data: { message: 'Datos de pago incompletos' }
      });
    }

    // Checkout con servicio
    const order = await service.checkout(
      req.user.id,
      items,
      paymentMethod,
      paymentDetails
    );

    // ✅ Ajuste: devolver solo totalAmount como esperan los tests
    return res.status(201).json({
      status: 'success',
      data: { totalAmount: order.totalAmount }
    });
  } catch (err) {
    // Manejo de errores según código
    if (err.code === 'PAYMENT_DECLINED') {
      return res.status(402).json({
        status: 'fail',
        data: { message: err.message }
      });
    }
    if (err.message === 'Stock insuficiente') {
      return res.status(400).json({
        status: 'fail',
        data: { message: err.message }
      });
    }
    return res.status(400).json({
      status: 'fail',
      data: { message: err.message }
    });
  }
};

exports.listOrders = async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const offset = (page - 1) * limit;

  const { rows, count } = await Order.findAndCountAll({
    where: { userId: req.user.id },
    limit,
    offset,
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  res.json({
    status: 'success',
    data: { total: count, page, limit, orders: rows }
  });
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }
    ]
  });

  if (!order || order.userId !== req.user.id) {
    return res.status(404).json({
      status: 'fail',
      data: { message: 'Orden no encontrada' }
    });
  }

  res.json({ status: 'success', data: order });
};
