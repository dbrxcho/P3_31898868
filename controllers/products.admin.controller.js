const { Product, Category, Tag } = require('../models');

exports.create = async (req, res) => {
  try {
    const { name, price, stock, categoryId, tagIds = [] } = req.body;

    if (!categoryId) {
      return res.status(400).json({ status: 'fail', data: { message: 'categoryId es obligatorio' } });
    }
    if (!name) {
      return res.status(400).json({ status: 'fail', data: { message: 'name es obligatorio' } });
    }
    if (price == null) {
      return res.status(400).json({ status: 'fail', data: { message: 'price es obligatorio' } });
    }
    if (stock == null) {
      return res.status(400).json({ status: 'fail', data: { message: 'stock es obligatorio' } });
    }

    const product = await Product.create(req.body);

    if (Array.isArray(tagIds) && tagIds.length) {
      const tags = await Tag.findAll({ where: { id: tagIds } });
      await product.setTags(tags);
    }

    res.status(201).json({ status: 'success', data: product });
  } catch (err) {
    res.status(400).json({ status: 'fail', data: { message: 'Error creando producto' } });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', data: product });
  } catch {
    res.status(500).json({ status: 'error', message: 'Error al obtener producto' });
  }
};

exports.update = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    await product.update(req.body);
    if (req.body.tagIds) {
      const tags = await Tag.findAll({ where: { id: req.body.tagIds } });
      await product.setTags(tags);
    }
    res.json({ status: 'success', data: product });
  } catch {
    res.status(400).json({ status: 'fail', data: { message: 'Error actualizando producto' } });
  }
};

exports.remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    await product.destroy();
    res.json({ status: 'success', data: { id: req.params.id } });
  } catch {
    res.status(500).json({ status: 'error', message: 'Error eliminando producto' });
  }
};
