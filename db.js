const Sequelize = require('sequelize');

/**
 * Configuração do Sequelize com SQLite.
 * @type {Sequelize}
 */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

module.exports = sequelize;
