import bcrypt from 'bcryptjs';
import { join } from 'path';
import { statSync, readdir } from 'fs';
import { stringify } from 'querystring';
import { MembresiaModel } from "../models/membresiaMysql.js";
import { ClaseModel } from '../models/claseMysql.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_PRIV || 'PRIVATE KEY');

const helpers = {};

function createdDate(file) {
    const { birthtime } = statSync(file)
    return birthtime
}

helpers.dias = [{ "id": 1, "dia": "lunes" }, { "id": 2, "dia": "martes" }, { "id": 3, "dia": "miercoles" }, { "id": 4, "dia": "jueves" }, { "id": 5, "dia": "viernes" }, { "id": 6, "dia": "sabado" }, { "id": 7, "dia": "domingo" }];

helpers.planes = {
    "price_1QWIQCKIeHEOMKlDpJMin5Ip": {
        "amount": 6000,
        "currency": "EUR",
        "activities": [
            "nogi"
        ]
    },
    "price_1QWIQ1KIeHEOMKlDdKtPM12x": {
        "amount": 5500,
        "currency": "EUR",
        "activities": [
            "mma"
        ]
    },
    "price_1QWIPnKIeHEOMKlD3PgMiAms": {
        "amount": 5450,
        "currency": "EUR",
        "activities": [
            "bjj913"
        ]
    },
    "price_1QWIPVKIeHEOMKlDPB5JGReN": {
        "amount": 4840,
        "currency": "EUR",
        "activities": [
            "bjj69"
        ]
    },
    "price_1QWIPAKIeHEOMKlDj3sm7vqf": {
        "amount": 4250,
        "currency": "EUR",
        "activities": [
            "bjj35"
        ]
    },
    "price_1QW5wcKIeHEOMKlDZ5HUPw8j": {
        "amount": 7260,
        "currency": "EUR",
        "activities": [
            "bjj",
            "nogi",
            "femenino"
        ]
    },
    "price_1QW5uBKIeHEOMKlDTuF8QGpf": {
        "amount": 4000,
        "currency": "EUR",
        "activities": [
            "bjjfemenino"
        ]
    },
    "price_1QWIQJKIeHEOMKlDpJMinXXL": {
        "amount": 8500,
        "currency": "EUR",
        "activities": [
            "bjj",
            "nogi",
            "mma",
            "bjjfemenino"
        ]
    }
}

helpers.listadoFotos = (req, res, next) => {
    const nif = req;
    var fotitos = [];
    var directorio = join(__dirname, "../public/img/imagenes", nif);
    readdir(directorio, (err, files) => {
        if (files) {
            files.forEach(file => {
                fotitos.push(file);
            });
        }
    });
    return fotitos;
}

helpers.listadoBackups = (req, res, next) => {
    var documentos = [];
    var directorio = join(__dirname, "../public/dumpSQL");
    readdir(directorio, (err, files) => {
        if (files) {
            files.forEach(file => {
                var item = {
                    'name': file,
                    'created_at': createdDate(directorio + "/" + file)
                }
                documentos.push(item);
            });
        } else {
            console.log("No hay files");
        }
    });
    return documentos;
}

helpers.encryptPass = async (password) => {
    const sal = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, sal);
    return password;
};

helpers.verifyPassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (e) {
        console.log(e);
    }
}

helpers.esSocio = async (req, res, next) => {
    try {
        //console.log("Req.user: ",req.user);
        var [membresia] = await MembresiaModel.getMembresiaByUserId(req.user.id);
        //console.log("Membresia: ",membresia[0]);

        var sessionId = membresia[0].session_id;
        const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items.data.price'] });
        console.log("session: ",session);
        const contratado = session.line_items.data[0].description.toLowerCase();;
        const { clase_id } = req.params;
        const [clase] = await ClaseModel.getById({ id: clase_id });
        const peticion = clase[0].nombre_actividad.toLowerCase();
        console.log(contratado + " entrando a " + peticion);

        if (contratado == 'ilimitado')
            return next();
        if (contratado.includes("adulto")) {
            if (peticion.includes("bjj") || peticion.includes("nogi") || peticion.includes("femenino")) {
                return next();
            }
            else {
                req.flash("warning", "Realice el pago de alguna membresia para poder unirse a clases");
                return res.redirect('/membresia/landing');
            }
        }
        if (contratado.includes("mma")) {
            if (peticion.includes("mma")) {
                return next();
            }
            else {
                req.flash("warning", "Amplie su membresia para poder unirse a clases de mma");
                return res.redirect('/membresia/landing');
            }

        }
        if (contratado.includes("nogi")) {
            if (peticion.includes("nogi")) {
                return next();
            }
            else {
                req.flash("warning", "Amplie su membresia para poder unirse a este tipo de clases");
                return res.redirect('/membresia/landing');
            }
        }
        if (contratado.includes("femenino")) {
            if (peticion.includes("femenino")) {
                return next();
            }
            else {
                req.flash("warning", "Amplie su membresia para poder unirse a este tipo de clases");
                return res.redirect('/membresia/landing');
            }

        }

    } catch (error) {
        req.flash("warning", "Realice el pago de alguna membresia para poder unirse a clases");
        return res.redirect('/membresia/landing');
    }


    return next();

    //return res.redirect('/membresia/landing');
}

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/signin');
}

helpers.isNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/profile');
}

helpers.isAdmin = (req, res, next) => {
    if (req.user.privilegio == "admin") {
        return next();
    }
    return res.redirect('/noperm');
}

helpers.isNotAdmin = (req, res, next) => {
    if (!req.user.privilegio == "admin") {
        return next();
    }
    return res.redirect('/noperm');
}

helpers.isMaster = (req, res, next) => {
    if (req.user.privilegio == "master") {
        return next();
    }
    return res.redirect('/noperm');
}

helpers.isNotMaster = (req, res, next) => {
    if (!req.user.privilegio == "master") {
        return next();
    }
    return res.redirect('/noperm');
}
/* helpers.hasPermission = async (req, res, next) => {
    //BIEN LEE POR PARAMS O POR BODY
    var logged_user_id = req.params.id;
    if (id_partida == null)
        id_partida = req.body.id_partida;
    const partida = (await db.query("select * from partidas where id = ?", [id_partida]))[0];
    //console.log(partida);
    //si es admin
    if (req.user && req.user.privilegio == "admin") {
        return next();
    }
    //Si es el creador de la partida
    if (partida.id_creador == req.user.id)
        return next();
    //si opera sobre el mismo.
    if (req.params.id_jugador && req.params.id_jugador == req.user.id)
        return next();

    var error = "No tienes permisos";
    return res.render('error', { error });
}
 */
helpers.insertarLog = async (usuario, accion, observacion) => {
    const log = {
        usuario,
        accion,
        observacion
    }
    try {
        console.log("Insertando log: " + stringify(log));
        const a = await query("insert into logs SET ?", [log]);
        return a;
    } catch (err) {
        console.log(err);
        return "error";
    }

}

/* helpers.dumpearSQL = () => {
    // dump the result straight to a file
    console.log("===============================");
    console.log(config.connectionConfig);

    mysqldump({
        connection: {
            host: config.connectionConfig.host,
            user: config.connectionConfig.user,
            password: config.connectionConfig.password,
            database: config.connectionConfig.database,
        },
        dumpToFile: './src/public/dumpSQL/dumpSAN' + Date.now() + '.sql',
    });
}
 */
export default helpers;