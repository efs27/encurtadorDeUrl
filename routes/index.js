var express = require('express');
var router = express.Router();
const Link= require('../models/link')

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

router.get('/url/:shortUrl', async (req, res, next) => {
  const shortUrl = req.params.shortUrl;

  const resultado = await Link.findOne({ where: { code: shortUrl } });
  if (!resultado) return res.sendStatus(404);

  res.json(resultado);
});

router.get('/:code/stats', async (req, res, next) => {
  const code = req.params.code;
  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);
  res.render('stats', resultado.dataValues);
})

router.get('/:code', async (req, res, next) => {
  const code = req.params.code;

  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);

  resultado.hits++;
  await resultado.save();

  res.redirect(resultado.url);
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Encurtador' });
});

function generateCode() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

router.post('/new', async (req, res, next) => {
  const url = req.body.url;
  const code = generateCode();

  const resultado = await Link.create({
    url,
    code
  })
  res.render('stats', resultado.dataValues);
})

module.exports = router;
