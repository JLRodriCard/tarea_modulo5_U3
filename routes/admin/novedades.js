var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/novedadesModel');


/* GET home page. */
router.get('/', async function (req, res, next) {

    var novedades = await novedadesModel.getNovedades();

    res.render('admin/novedades', { //novedades.hbs
        layout: 'admin/layout',// aca levanta el archivo layout y aplica el formato - diseño css a la pagina
        persona: req.session.nombre, //para imprimir en novevedades el nombre del usuario que accedera a la pagina luego de loguearse
        novedades

    });
});


router.get('/agregar',(req, res, next)=>{
    res.render('admin/agregar',{
        layout:'admin/layout'

    })
});


router.post('/agregar', async (req, res, next) => {
    try {

        console.log(req.body)

        if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
            await novedadesModel.insertNovedad(req.body);
            res.redirect('/admin/novedades')
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'Se requieren completar todos los campos'
            })
        }
    } catch (error) {
        console.log(error)
        res.render('admin/agregar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se pueden cargar novedades'
        })
    }

})

module.exports = router;