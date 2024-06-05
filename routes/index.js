var express = require('express');
var router = express.Router();
const Link = require('../models/link');
const Sequelize = require('sequelize');

/**
 * Retorna as estatísticas de uma URL encurtada.
 * @route GET /:code/stats
 * @param {string} code - Código da URL encurtada.
 * @returns {Object} Estatísticas da URL encurtada.
 */
router.get('/:code/stats', async (req, res, next) => {
  const code = req.params.code;
  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);
  res.render('stats', resultado.dataValues);
});

/**
 * Redireciona para a URL original e incrementa o contador de acessos.
 * @route GET /:code
 * @param {string} code - Código da URL encurtada.
 * @returns {void}
 */
router.get('/:code', async (req, res, next) => {
  const code = req.params.code;
  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);

  resultado.hits++;
  await resultado.save();

  res.redirect(resultado.url);
});

/**
 * Renderiza a página inicial.
 * @route GET /
 * @returns {void}
 */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Encurtador' });
});

/**
 * Gera um código aleatório para a URL encurtada.
 * @returns {string} Código gerado.
 */
function generateCode() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

/**
 * Cria uma nova URL encurtada.
 * @route POST /new
 * @param {string} url - URL original a ser encurtada.
 * @returns {Object} Dados da URL encurtada.
 */
router.post('/new', async (req, res, next) => {
  const url = req.body.url;
  const code = generateCode();

  const resultado = await Link.create({
    url,
    code
  });
  res.render('stats', resultado.dataValues);
});

/**
 * Retorna todas as URLs encurtadas em uma data específica.
 * @route GET /date/:date
 * @param {string} date - Data no formato YYYY-MM-DD.
 * @returns {Array} Lista de URLs encurtadas na data especificada.
 */
router.get('/date/:date', async (req, res, next) => {
  const date = req.params.date;
  const startDate = new Date(date);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  const resultados = await Link.findAll({
    where: {
      createdAt: {
        [Sequelize.Op.gte]: startDate,
        [Sequelize.Op.lt]: endDate,
      },
    },
  });

  if (resultados.length === 0) return res.sendStatus(404);
  res.json(resultados);
});

/**
 * Retorna a URL original a partir do código encurtado.
 * @route GET /url/:shortUrl
 * @param {string} shortUrl - Código da URL encurtada.
 * @returns {Object} Dados da URL original.
 */
router.get('/url/:shortUrl', async (req, res, next) => {
  const shortUrl = req.params.shortUrl;

  const resultado = await Link.findOne({ where: { code: shortUrl } });
  if (!resultado) return res.sendStatus(404);

  res.json(resultado);
});

module.exports = router;
