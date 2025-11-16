module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, { tableName: 'tags' });
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Product, { through: 'ProductTag', foreignKey: 'tagId' });
  };
  return Tag;
};
