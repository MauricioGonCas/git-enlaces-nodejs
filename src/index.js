const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path= require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySqlStore = require('express-mysql-session');
const passport= require('passport');

const {database} =require('./keys');

//Inicializaciones
const app = express();

require('./lib/passport');

//Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers:require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//middleware
app.use(session({
    secret: 'sesionesnodesession',
    resave: false,
    saveUninitialized: false,
    store:new MySqlStore(database)
}));
app.use(flash());
app.use(morgan('dev')); //muestra los mensajes por la consola
app.use(express.urlencoded({ extended:false })); //permite recibir datos desde el cliente al servidor
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//variables globales que se pueden acceder desde cualquier parte
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})

//Rutas URL del servidor
app.use(require('./routes'));
app.use(require('./routes/autentication'));
app.use('/links',require('./routes/links'));

//Archivos publicos que puede acceder el navegador a ellos
app.use(express.static(path.join(__dirname,'public')))


//Iniciar el servidor 
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto',app.get('port'));
});