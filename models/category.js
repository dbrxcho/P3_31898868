module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true }
  }, { tableName: 'categories' });

  Category.associate = (models) => {
    Category.hasMany(models.Product, { foreignKey: 'categoryId' });
  };

  return Category;
};
