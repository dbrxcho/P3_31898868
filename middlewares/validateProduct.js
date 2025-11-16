module.exports = function validateProduct(req, res, next) {
  const { name, price, stock, categoryId, tagIds } = req.body;

  if (req.method === 'POST') {
    if (!categoryId) return res.status(400).json({ status: 'fail', data: { message: 'categoryId es obligatorio' } });
    if (!name) return res.status(400).json({ status: 'fail', data: { message: 'name es obligatorio' } });
    if (price == null) return res.status(400).json({ status: 'fail', data: { message: 'price es obligatorio' } });
    if (stock == null) return res.status(400).json({ status: 'fail', data: { message: 'stock es obligatorio' } });
  }

  if (price != null && typeof price !== 'number') {
    return res.status(400).json({ status: 'fail', data: { message: 'price debe ser numérico' } });
  }
  if (stock != null && !Number.isInteger(stock)) {
    return res.status(400).json({ status: 'fail', data: { message: 'stock debe ser entero' } });
  }
  if (categoryId != null && !Number.isInteger(categoryId)) {
    return res.status(400).json({ status: 'fail', data: { message: 'categoryId debe ser entero' } });
  }
  if (tagIds && !Array.isArray(tagIds)) {
    return res.status(400).json({ status: 'fail', data: { message: 'tagIds debe ser un array de enteros' } });
  }

  next();
};

console.log('validateProduct middleware cargado correctamente');
