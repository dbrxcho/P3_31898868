const { Product, Category, Tag } = require('../models');

class ProductRepository {
  async create(data) { return Product.create(data); }
  async findById(id) { return Product.findByPk(id, { include: [Category, Tag] }); }
  async update(id, data) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return product.update(data);
  }
  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.setTags([]); // limpiar pivot
    await product.destroy();
    return product;
  }
  async setRelations(product, categoryId, tagIds = []) {
    if (categoryId) await product.setCategory(categoryId);
    if (tagIds) await product.setTags(tagIds);
    return this.findById(product.id);
  }
  async list(query) {
    const { where, include, offset, limit, order } = query;
    return Product.findAndCountAll({ where, include, offset, limit, order, distinct: true });
  }
}
module.exports = new ProductRepository();
