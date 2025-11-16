const { productsRepository } = require('../repositories/products.repository');
const { Category, Tag } = require('../models');

exports.getByIdSlug = async (req, res) => {
  try {
    const { id, slug } = req.params;
    const product = await productsRepository.findById(id, {
      include: [
        { model: Category, attributes: ['id','name'] },
        { model: Tag, attributes: ['id','name'], through: { attributes: [] } }
      ]
    });
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    if (product.slug !== slug) {
      const canonical = `/p/${product.id}-${product.slug}`;
      return res.status(301).json({ status: 'redirect', message: 'Moved Permanently', data: { location: canonical } });
      // O: return res.redirect(301, canonical);
    }
    return res.status(200).json({ status: 'success', data: product });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Error al obtener producto' });
  }
};
