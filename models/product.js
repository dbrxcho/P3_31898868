'use strict';
const slugify = require('slugify');

function toSlug(name) {
  return slugify(name, { lower: true, strict: true });
}

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    sku: { type: DataTypes.STRING, unique: true }, 
    slug: { type: DataTypes.STRING },             
    artist: DataTypes.STRING,
    album: DataTypes.STRING,
    year: DataTypes.INTEGER,
    genre: DataTypes.STRING,
    label: DataTypes.STRING,
    format: DataTypes.STRING,
    condition: DataTypes.STRING,
    colorVariant: DataTypes.STRING,
    categoryId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'products',
    indexes: [
      { fields: ['slug'], unique: true }, 
      { fields: ['name'] },
      { fields: ['price'] },
      { fields: ['categoryId'] }
    ]
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
    Product.belongsToMany(models.Tag, { through: 'ProductTag', foreignKey: 'productId' });
  };

  Product.addHook('beforeValidate', (product) => {
    if (product.name) product.slug = toSlug(product.name);
  });

  Product.addHook('beforeUpdate', (product) => {
    if (product.changed('name')) product.slug = toSlug(product.name);
  });

  return Product;
};
