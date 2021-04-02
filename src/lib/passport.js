const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'nombreusuario',
    passwordField: 'contrasena',
    passReqToCallback:true
    
}, async (req, nombreusuario, contrasena, done) => {
    console.log(req.body);
    const filas = await pool.query('SELECT * FROM usuario WHERE nombreusuario=?', [nombreusuario]);
    if (filas.length > 0) {
        const usuario = filas[0];
        const validarcontrasena = await helpers.matchPassword(contrasena, usuario.contrasena);
        if (validarcontrasena) {
            done(null, usuario, req.flash('success','Bienvenido '+usuario.nombreusuario));
        } else {
            done(null, false, req.flash('message','Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message','El usuario no existe'));
    }
}));


passport.use('local.signup', new LocalStrategy({
    usernameField: 'nombreusuario',
    passwordField: 'contrasena',
    passReqToCallback:true
}, async (req, nombreusuario, contrasena,done) => {
    //console.log(req.body);
    const { nombrecompleto} = req.body;
    const nuevousuario = {
        nombreusuario,
        contrasena,
        nombrecompleto
    }
    nuevousuario.contrasena = await helpers.encryptPassword(contrasena);
    const resultado = await pool.query('INSERT INTO usuario SET ?', [nuevousuario]);
    nuevousuario.id = resultado.insertId;
    return done(null,nuevousuario)
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id,done) => {
    
    const filas = await pool.query('SELECT * FROM usuario WHERE id=?', [id]);
    done(null, filas[0]);
});