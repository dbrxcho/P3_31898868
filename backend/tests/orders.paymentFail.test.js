jest.mock('axios', () => ({
  post: jest.fn((url, data) => {
    if (data.cardToken === 'tok_test') {
      return Promise.resolve({ data: { status: 'DECLINED' } });
    }
    return Promise.resolve({ data: { status: 'APPROVED' } });
  })
}));

const request = require('supertest');
const app = require('../app');
const { sequelize, User, Product, Category } = require('../models');
const jwt = require('jsonwebtoken');

describe('Orders - pago rechazado', () => {
  let token, product;

  beforeAll(async () => {
    // sincroniza la base en memoria
    await sequelize.sync({ force: true });

    const user = await User.create({
      nombreCompleto: 'Test',
      email: 'test@example.com',
      password: 'hashed'
    });

    token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    // Crear categoría primero
    const category = await Category.create({ name: 'Rock' });

    // Crear producto con name y categoryId correctos
    product = await Product.create({
      name: 'Vinilo',
      description: 'Edición limitada',
      price: 20,
      stock: 5,
      categoryId: category.id
    });
  });

  it('responde 402 y hace rollback total', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: product.id, quantity: 2 }],
        paymentMethod: 'CreditCard',
        paymentDetails: { cardToken: 'tok_test', currency: 'USD' }
      });

    expect(res.status).toBe(402);
    expect(res.body.status).toBe('fail');

    const updated = await Product.findByPk(product.id);
    expect(updated.stock).toBe(5); // rollback → stock intacto
  });

  afterAll(async () => {
    // cerrar conexión de Sequelize para que Jest no se quede colgado
    await sequelize.close();
  });
});
