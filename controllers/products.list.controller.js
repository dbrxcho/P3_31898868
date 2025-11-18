const { productsRepository } = require('../repositories/products.repository');
const { ProductQueryBuilder } = require('../services/product-query.builder');

exports.listPublic = async (req, res) => {
  try {
    const qb = new ProductQueryBuilder(req.query);
    const query = qb.build();
    const { rows, count } = await productsRepository.findAndCount(query);
    return res.status(200).json({
      status: 'success',
      data: rows,
      pagination: { page: qb.page, limit: qb.limit, total: count, pages: Math.ceil(count / qb.limit) }
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Error al listar productos' });
  }
};
