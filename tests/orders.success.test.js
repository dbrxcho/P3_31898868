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

describe('Orders - éxito transaccional', () => {
  let token, product;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Crear usuario de prueba
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

    // Crear categoría obligatoria
    const category = await Category.create({ name: 'Rock' });

    // Crear producto con todos los campos requeridos
    product = await Product.create({
      name: 'Vinilo',
      description: 'Edición limitada',
      price: 20,
      stock: 5,
      categoryId: category.id
    });

    console.log('✅ Usuario creado:', user.toJSON());
    console.log('✅ Token generado:', token);
    console.log('✅ Categoría creada:', category.toJSON());
    console.log('✅ Producto creado:', product.toJSON());
  });

  it('crea orden y reduce stock cuando pago es aprobado', async () => {
    const payload = {
      items: [{ productId: product.id, quantity: 2 }],
      paymentMethod: 'CreditCard',
      paymentDetails: { cardToken: 'tok_test', currency: 'USD' }
    };

    console.log('➡️ Payload enviado:', payload);

    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    // Logs de depuración
    console.log('📩 Respuesta del servidor:');
    console.log('Status:', res.status);
    console.log('Body:', res.body);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.totalAmount).toBe(40);

    const updated = await Product.findByPk(product.id);
    console.log('📦 Stock actualizado del producto:', updated.stock);

    expect(updated.stock).toBe(3);
  });

  afterAll(async () => {
    // cerrar conexión de Sequelize para que Jest no se quede colgado
    await sequelize.close();
  });
});
