import { UsuarioModel } from '../models/usuarioMysql.js';
import { AsistenciaModel } from '../models/asistenciaMysql.js';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

import { validateUsuario, validatePartialUsuario } from '../schemas/validaciones.js';

export class UsuarioController {

    static async getAll(req, res) {
        const usuarios = await UsuarioModel.getAll();
        res.render("usuarios/list", { usuarios });

    }
    static async getById(req, res) {
        const { id } = req.params;
        const [usuario] = await UsuarioModel.getById({ id });
        const asistencias = await AsistenciaModel.getByUserId({ user_id:id });
        console.log(asistencias);
        res.render("usuarios/plantilla", { usuario,asistencias });
    }

    static async create(req, res) {
        const result = validateUsuario(req.body);

        if (!result.success) {
            // 422 Unprocessable Entity
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        var pictureURL = "";
        if (typeof req.file !== 'undefined')
            pictureURL = req.file.filename;
        const {
            nombre,
            descripcion,
        } = req.body;
        const item = {
            nombre,
            descripcion,
            pictureURL,

        };
        const nuevaACt = await UsuarioModel.create({ input: item });
        req.flash("success", "Usuario insertado correctamente");
        res.redirect("/usuarios/list"); //te redirige una vez insertado el item

    }

    static async delete(req, res) {
        const { id } = req.params
        console.log("deleteUsuario: " + JSON.stringify(id));
        const result = await UsuarioModel.delete({ input: id })
        if (result === false) {
            return res.status(404).json({ message: 'Usuario not found' })
        }

        //req.flash("success", "Usuario borrado correctamente");
        res.redirect("/usuarios/list");
    }

    static async update(req, res) {
        console.log("update");
        const { id } = req.params;
        console.log(id);
        console.log(req.body);

        const result = validatePartialUsuario(req.body);
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        try {
            const {
                nombre,
                apellidos,
                email,
                pais_telefono,
                telefono,
                nacionalidad,
                peso,
                cinturon,
                grado,
                fecha_nacimiento,
                nif,

            } = req.body;

            /*        if (typeof req.file !== 'undefined') {
                       pictureURL = req.file.filename;
                   } */
            const newItem = {
                id,
                nombre,
                apellidos,
                email,
                pais_telefono,
                telefono,
                nacionalidad,
                peso,
                cinturon,
                grado,
                fecha_nacimiento,
                nif,
            };
            console.log(newItem);
            const result = await UsuarioModel.update({ input: newItem })
            if (result === false) {
                return res.status(404).json({ message: 'usuario not found' })
            }
            req.flash("success", "usuario modificado correctamente");
            res.redirect("/usuarios/get/"+id);
        } catch (error) {
            console.error(error.code);
            //req.flash("error", "Hubo algun error");
            res.redirect("/error");
        }

    }

}