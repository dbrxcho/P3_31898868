require('dotenv').config();
const { sequelize, Category, Tag, Product } = require('../models');

async function run() {
  await sequelize.sync({ force: true });

  const categories = await Category.bulkCreate([
    { name: 'Rock' },
    { name: 'Jazz' },
    { name: 'Pop' }
  ]);

  const tags = await Tag.bulkCreate([
    { name: 'Edición limitada' },
    { name: 'Remasterizado' },
    { name: 'Importado' }
  ]);

  const product = await Product.create({
    name: 'Kind of Blue',
    description: 'Miles Davis, 1959, edición clásica',
    price: 24.99,
    stock: 30,
    sku: 'MD-KOB-1959',
    artist: 'Miles Davis',
    album: 'Kind of Blue',
    year: 1959,
    genre: 'Jazz',
    label: 'Columbia',
    format: 'LP',
    condition: 'New',
    colorVariant: 'Black',
    categoryId: categories[1].id, // Jazz
  });

  await product.setTags([tags[1], tags[2]]); // Remasterizado, Importado

  console.log('Seeds completados');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});