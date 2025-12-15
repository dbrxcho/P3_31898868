const { sequelize, Product, Order, OrderItem } = require('../models');
const CreditCardPaymentStrategy = require('../payments/CreditCardPaymentStrategy');

class OrderService {
  constructor() {
    this.strategies = {
      CreditCard: new CreditCardPaymentStrategy()
      // Futuro: agregar PayPal, BankTransfer, etc.
    };
  }

  selectStrategy(method) {
    const strategy = this.strategies[method];
    if (!strategy) throw new Error('Método de pago no soportado');
    return strategy;
  }

  async checkout(userId, items, paymentMethod, paymentDetails) {
    return await sequelize.transaction(async (t) => {
      // 1) Verificar stock y calcular total
      let totalAmount = 0;
      const products = [];

      for (const it of items) {
        const product = await Product.findByPk(it.productId, { transaction: t, lock: t.LOCK.UPDATE });
        if (!product) throw new Error('Producto no encontrado');
        if (product.stock < it.quantity) throw new Error('Stock insuficiente');
        products.push(product);
        totalAmount += product.price * it.quantity;
      }

      // 2) Procesar pago con estrategia
      const strategy = this.selectStrategy(paymentMethod);
      const result = await strategy.processPayment(paymentDetails, totalAmount);
      if (result.status !== 'APPROVED') {
        const err = new Error('Pago rechazado');
        err.code = 'PAYMENT_DECLINED';
        throw err; // rollback automático
      }

      // 3) Crear orden
      const order = await Order.create(
        { userId, status: 'COMPLETED', totalAmount },
        { transaction: t }
      );

      // 4) Crear items y actualizar stock
      for (let i = 0; i < items.length; i++) {
        const { productId, quantity } = items[i];
        const product = products[i];
        await OrderItem.create(
          { orderId: order.id, productId, quantity, unitPrice: product.price },
          { transaction: t }
        );
        await product.update({ stock: product.stock - quantity }, { transaction: t });
      }

      return order; // commit al terminar la función
    });
  }
}

module.exports = OrderService;
