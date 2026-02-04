'use strict';

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    status: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'CANCELED', 'PAYMENT_FAILED'),
      defaultValue: 'PENDING',
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'Orders',   // asegura nombre correcto de tabla
    timestamps: true       // agrega createdAt/updatedAt
  });

  Order.associate = (models) => {
    if (models.User) {
      Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
    if (models.OrderItem) {
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
    }
  };

  return Order;
};
