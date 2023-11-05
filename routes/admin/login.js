var express = require('express');
var router = express.Router();
var usuariosModel = require('../../models/usuariosModel'); //requiere funcion de archivo usuaraiosModel

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('admin/login', { //login.hbs
    layout: 'admin/layout'// aca levanta el archivo layout
  });
});

router.get('/logout', function (req, res, next) {
  req.session.destroy();// para destruir las variables de sesiones una vez que se presione botor cerrar sesion
  res.render('admin/login', {
    layout: 'admin/layout'

  });
}); // aca se cierra logout



router.post('/', async (req, res, next) => {
  try {

    var usuario = req.body.usuario; //variable que captura el usuario que se ingresa el el formulario de login
    var password = req.body.password; //variable que captura el password que se ingresa el el formulario de login

    var data = await usuariosModel.getUserByUsernameAndPassword(usuario, password);

    if (data != undefined) {

      req.session.id_usuario = data.id;
      req.session.nombre = data.usuario;

      res.redirect('/admin/novedades');
    } else {
      res.render('admin/login', {
        layout: 'admin/layout',
        error: true
      });
    }

  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
