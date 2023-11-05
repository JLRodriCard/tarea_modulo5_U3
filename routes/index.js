var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /*res.render('index', { title: 'Express' });*/
  res.redirect('/admin/login'); /*para redireccionar al login directamente*/
});

module.exports = router;
