jest.mock('axios', () => ({
  post: jest.fn((url, data) => {
    if (data.cardToken === 'tok_fail') {
      return Promise.resolve({ data: { status: 'DECLINED' } });
    }
    return Promise.resolve({ data: { status: 'APPROVED' } });
  })
}));

const request = require('supertest');
const app = require('../app');
const { sequelize, User, Product, Category } = require('../models');
const jwt = require('jsonwebtoken');

describe('Orders - fallo por stock insuficiente', () => {
  let token, product;

  beforeAll(async () => {
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
      stock: 1,
      categoryId: category.id
    });
  });

  it('responde 400 y no modifica stock', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: product.id, quantity: 3 }],
        paymentMethod: 'CreditCard',
        paymentDetails: { cardToken: 'tok_test', currency: 'USD' }
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');

    const updated = await Product.findByPk(product.id);
    expect(updated.stock).toBe(1); // stock intacto
  });
});
