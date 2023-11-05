var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('admin/novedades', { //novedades.hbs
        layout: 'admin/layout',// aca levanta el archivo layout y aplica el formato - diseño css a la pagina
        persona: req.session.nombre //para imprimir en novevedades el nombre del usuario que accedera a la pagina luego de loguearse
    });
});


module.exports = router;