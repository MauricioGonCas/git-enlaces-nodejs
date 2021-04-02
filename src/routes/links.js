const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLogeedIn} =require('../lib/auth');


router.get('/add',isLogeedIn, (req, res) => {
    res.render('links/add');
});

//ruta para agregar una nueva url
router.post('/add',isLogeedIn, async (req, res) => {
    //obtenemos los datos que nos envian desde el formulario
    const { titulo, url, descripcion } = req.body;
    const nuevolink = {
        titulo,
        url,
        descripcion,
        usuario_id:req.user.id
    };

    //INSERTAMOS LOS DATOS EN LA BASE DE DATOS
    await pool.query('INSERT INTO link set ?', [nuevolink]);
    //console.log(nuevolink);
    req.flash('success','Enlace agregado correctamente');
    res.redirect('/links');
});

//ruta para listar los enlaces
router.get('/',isLogeedIn, async (req, res) => {
    const links= await pool.query('SELECT * FROM link WHERE usuario_id=?',[req.user.id]);
    
    //console.log(links);
    res.render('links/list',{links});
});

//ruta para eliminar
router.get('/delete/:id',isLogeedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM link WHERE id=?', [id]);
    req.flash('success','Enlace eliminado satisfactoriamente');
    res.redirect('/links');
});

//ruta para editar
router.get('/edit/:id',isLogeedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM link WHERE id=?', [id]);
    
    res.render('links/edit',{link:links[0]});
})

router.post('/edit/:id',isLogeedIn, async (req, res) => {
    const { id } = req.params;
    const { titulo, url, descripcion } = req.body;
    const nuevolink = {
        titulo,
        url,
        descripcion
    };

    await pool.query("UPDATE link SET ? WHERE id=?", [nuevolink, id]);
    
    req.flash('success', 'Enlace editado satisfactoriamente');
    res.redirect('/links');
});

module.exports = router;