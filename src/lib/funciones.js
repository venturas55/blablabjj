import bcrypt from 'bcryptjs';
import { join } from 'path';
import { statSync, readdir } from 'fs';
import mysqldump from 'mysqldump';
import { stringify } from 'querystring';
import { promisify } from 'util';
import db from "../database.js";

const helpers = {};

function createdDate(file) {
    const { birthtime } = statSync(file)
    return birthtime
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

helpers.encryptPass = async(password) => {
    const sal = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, sal);
    return password;
};

helpers.verifyPassword = async(password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (e) {
        console.log(e);
    }
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
helpers.hasPermission = async (req, res, next) => {
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

helpers.insertarLog = async(usuario, accion, observacion) => {
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

helpers.dumpearSQL = () => {
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

export default helpers;