'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};

// Inicializar Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], { ...config });
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    { ...config }
  );
}

// Cargar todos los modelos automáticamente (excepto este archivo y tests)
const modelFiles = fs
  .readdirSync(__dirname)
  .filter(file => (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    !file.endsWith('.test.js')
  ));

for (const file of modelFiles) {
  const imported = require(path.join(__dirname, file));

  // Ejecuta funciones (factory) con (sequelize, DataTypes); si es un modelo directo, úsalo tal cual
  const model = typeof imported === 'function'
    ? imported(sequelize, Sequelize.DataTypes)
    : imported;

  if (!model || !model.name) {
    console.error(`❌ El archivo ${file} no retornó un modelo válido (model.name ausente).`);
    continue;
  }

  db[model.name] = model;
}

// Log de modelos crudos cargados
console.log('📦 Modelos cargados (keys en db):', Object.keys(db));

// Validar que los modelos clave existan antes de asociar
const required = ['User', 'Product', 'Category', 'Order', 'OrderItem'];
for (const name of required) {
  if (!db[name]) {
    console.error(`⚠️ Falta el modelo ${name}. Revisa nombre de archivo y return del modelo.`);
  }
}

// Aplicar asociaciones si el modelo las define
Object.keys(db).forEach(modelName => {
  const model = db[modelName];
  if (typeof model.associate === 'function') {
    try {
      model.associate(db);
    } catch (err) {
      console.error(`💥 Error asociando ${modelName}: ${err.message}`);
      throw err;
    }
  }
});

// Exportar instancia y referencia de Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
