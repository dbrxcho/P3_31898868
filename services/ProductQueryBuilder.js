const { Op } = require('sequelize');
const { Category, Tag } = require('../models');

class ProductQueryBuilder {
  constructor() {
    this.where = {};
    this.include = [];
    this.page = 1;
    this.limit = 10;
    this.order = [['createdAt', 'DESC']];
  }
  setPagination(page = 1, limit = 10) {
    this.page = Number(page) || 1;
    this.limit = Number(limit) || 10;
    return this;
  }
  addSearch(term) {
    if (!term) return this;
    this.where[Op.or] = [
      { name: { [Op.iLike]: `%${term}%` } },
      { description: { [Op.iLike]: `%${term}%` } },
      { artist: { [Op.iLike]: `%${term}%` } },
      { album: { [Op.iLike]: `%${term}%` } }
    ];
    return this;
  }
  addPriceRange(min, max) {
    if (min || max) {
      this.where.price = {};
      if (min) this.where.price[Op.gte] = min;
      if (max) this.where.price[Op.lte] = max;
    }
    return this;
  }
  addCategory(category) {
    if (!category) return this;
    if (!this.include.find(i => i.model === Category)) this.include.push({ model: Category });
    if (isNaN(Number(category))) {
      this.include = this.include.map(i => i.model === Category ? { ...i, where: { name: category } } : i);
    } else {
      this.where.categoryId = Number(category);
    }
    return this;
  }
  addTags(tagIds) {
    if (!tagIds) return this;
    const ids = String(tagIds).split(',').map(n => Number(n)).filter(Boolean);
    if (ids.length) this.include.push({ model: Tag, where: { id: { [Op.in]: ids } } });
    return this;
  }
  addCustomFilters({ artist, genre, year, label, format, condition, colorVariant }) {
    if (artist) this.where.artist = { [Op.iLike]: `%${artist}%` };
    if (genre) this.where.genre = { [Op.iLike]: `%${genre}%` };
    if (label) this.where.label = { [Op.iLike]: `%${label}%` };
    if (format) this.where.format = format;
    if (condition) this.where.condition = condition;
    if (colorVariant) this.where.colorVariant = colorVariant;
    if (year) this.where.year = Number(year);
    return this;
  }
  build() {
    const offset = (this.page - 1) * this.limit;
    return { where: this.where, include: this.include, offset, limit: this.limit, order: this.order };
  }
}
module.exports = ProductQueryBuilder;
