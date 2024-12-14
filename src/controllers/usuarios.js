import { UsuarioModel } from '../models/usuarioMysql.js';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

import { validateUsuario, validatePartialUsuario } from '../schemas/validaciones.js';

export class UsuarioController {

    static async getAll(req, res) {
        const { genre } = req.query
        const usuarios = await UsuarioModel.getAll();
        res.render("usuarios/list", { usuarios });

    }
    static async getById(req, res) {
        console.log("por aqui");
        const { id } = req.params;
        const [usuario] = await UsuarioModel.getById({ id });
        console.log(usuario);
        res.render("usuarios/plantilla", { usuario });
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
          const result = validatePartialUsuario(req.body);
        
     /*     if (!result.success) {
             return res.status(400).json({ error: JSON.parse(result.error.message) })
         }  */

        const { id } = req.params;
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
                pictureURL
            } = req.body;

            if (typeof req.file !== 'undefined') {
                pictureURL = req.file.filename;
            }
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
                pictureURL
            };
            console.log(newItem);
            const result = await UsuarioModel.update({ input: newItem })
            if (result === false) {
                return res.status(404).json({ message: 'usuario not found' })
            }
            //req.flash("success", "usuarios modificada correctamente");
            res.redirect("/usuarios/list");
        } catch (error) {
            console.error(error.code);
            //req.flash("error", "Hubo algun error");
            res.redirect("/error");
        }

    }

}