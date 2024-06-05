const Sequelize = require('sequelize');
const database = require('../db');

/**
 * Modelo de Link.
 * @typedef {Object} Link
 * @property {number} id - ID do link.
 * @property {string} code - Código da URL encurtada.
 * @property {string} url - URL original.
 * @property {number} hits - Número de acessos.
 */
const Link = database.define('link', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  hits: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
});

module.exports = Link;
