import express, { urlencoded, json } from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars'; //Para usar plantillas
import * as url from 'url';
import * as path from 'path';    //Para manejar directorios, basicamente unirlos 
import flash from 'connect-flash';  //Para mostar mensajes
import session from 'express-session'; //Lo necesita el flash tb
import MySQLstore from 'express-mysql-session'; // para poder guardar la sesion en la sql
import passport from 'passport';
import { database } from './config.js';
import handlebars from './lib/handlebars.js';

//const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import { corsMiddleware } from './middlewares/cors.js';

import { indexRouter } from './routes/index.js';
import { actividadesRouter } from './routes/actividades.js';
import { asistenciasRouter } from './routes/asistencias.js';
import { calendarioRouter } from './routes/calendario.js';
import { usuariosRouter } from './routes/usuarios.js';
import { clasesRouter } from './routes/clases.js';
import { weekRouter } from './routes/week.js';
import { apiRouter } from './routes/api.js';
import { authRouter } from './routes/authentication.js';
import { fotosRouter } from './routes/fotos.js';


//Initialization
const app = express();
app.disable('x-powered-by'); //Deshabilitar el hjeader X-powered-by: Express
//import './lib/passport.js'; //para que se entere de la autentificacion que se ha creado 

//Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({  //con esto se configura el app.engine
    defaultLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: handlebars
}));
app.set('view engine', '.hbs'); //Para utilizar el app.engine

//Middlewares
app.use(session({
    secret: 'mysesion',
    resave: false,
    saveUninitialized: false,
    store: new MySQLstore(database)
}))
app.use(flash());       // Para poder usar el middleware de enviar mensajes popups
app.use(morgan('dev'));
app.use(urlencoded({ extended: false })); //aceptar los datos desde los formularios sin aceptar imagenes ni nada raro
app.use(json()); //Para enviar y recibir jsons.
app.use(corsMiddleware()); //Cors middle
app.use(passport.initialize()); //iniciar passport
app.use(passport.session());    //para que sepa donde guardar y como manejar los datos

//Variables globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.warning = req.flash('warning');
    app.locals.danger = req.flash('danger');
    app.locals.user = req.user;
    next();
});

//Public
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(path.join(__dirname + '../node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname + '../node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname + '../node_modules/jquery/dist')))

//Routes
app.use(indexRouter);
app.use(authRouter);
app.use('/actividades', actividadesRouter);
app.use('/asistencias', asistenciasRouter);
app.use('/calendario', calendarioRouter);
app.use('/usuarios', usuariosRouter);
app.use('/clases', clasesRouter);
app.use('/week', weekRouter);
app.use(apiRouter);
app.use(fotosRouter);

//Starting
app.listen(app.get('port'), () => {
    console.log("Running on http://localhost:4000", app.get('port'));
})