var express = require('express');
var router = express.Router();

/**
 * Lista de usuários.
 * @route GET /users
 * @returns {string} Mensagem de resposta.
 */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
