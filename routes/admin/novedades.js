var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/novedadesModel');
const util = require('util');
const cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);



/* GET home page. */
router.get('/', async function (req, res, next) {

    var novedades = await novedadesModel.getNovedades();

    res.render('admin/novedades', { //novedades.hbs
        layout: 'admin/layout',// aca levanta el archivo layout y aplica el formato - diseño css a la pagina
        persona: req.session.nombre, //para imprimir en novevedades el nombre del usuario que accedera a la pagina luego de loguearse
        novedades

    });
});


router.get('/agregar', (req, res, next) => {
    res.render('admin/agregar', {
        layout: 'admin/layout'

    })
});


router.post('/agregar', async (req, res, next) => {
    try {

        var img_id='';
            if (req.files && Object.keys(req.files).length>0){
                    Imagen=req.files.imagen;
                    img_id=(await uploader (imagen.tempFilePath)).public_id;
            }

        console.log(req.body)

        if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
            await novedadesModel.insertNovedad({
                ...req.body,
                img_id
            });


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

});

/*para eliminar una novedad aplica la siguiente funcion*/
router.get('/eliminar/:id', async (req, res, next) => {
    var id = req.params.id;
    await novedadesModel.deleteNovedadesById(id);
    res.redirect('/admin/novedades');

}); //aca se cierra get eliminar


/*codigo para llamar a una sola novedad por ID y que se oueda editar*/

router.get('/modificar/:id', async (req, res, next) => {
    var id = req.params.id;
    console.log(req.params.id);
    var novedad = await novedadesModel.getNovedadById(id);


    res.render('admin/modificar', {
        layout: 'admin/layout',
        novedad
    })



});


/* para impactar la modificacion en la base de datos*/

router.post('/modificar', async (req, res, next) => {

    try {

        var obj = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            cuerpo: req.body.cuerpo
        }
        console.log(obj)

        await novedadesModel.modificarNovedadById(obj, req.body.id);
        res.redirect('/admin/novedades');

    } catch (error) {

        console.log(error)
        res.render('admin/modificar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se pudo modificar la novedad seleccionada'
        })
    }



});



module.exports = router;