import { UsuarioModel } from '../models/usuarioMysql.js';
import { AsistenciaModel } from '../models/asistenciaMysql.js';
import { ExtraModel } from '../models/extraMysql.js'

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
//import db from "../database.js"; //db hace referencia a la BBDD
import { validateUsuario, validatePartialUsuario } from '../schemas/validaciones.js';

const cinturones = [
    { "value": "blanco", "nombre": "Blanco" },
    { "value": "gris-blanco", "nombre": "Blanco y Gris" },
    { "value": "gris", "nombre": "Gris" },
    { "value": "gris-negro", "nombre": "Gris y Negro" },
    { "value": "amarillo-blanco", "nombre": "Amarillo y Blanco" },
    { "value": "amarillo", "nombre": "Amarillo" },
    { "value": "amarillo-negro", "nombre": "Amarillo y Negro" },
    { "value": "naranja-blanco", "nombre": "Naranja y Blanco" },
    { "value": "naranja", "nombre": "Naranja" },
    { "value": "naranja-negro", "nombre": "Naranja y Negro" },
    { "value": "verde-blanco", "nombre": "Verde y Blanco" },
    { "value": "verde", "nombre": "Verde" },
    { "value": "verde-negro", "nombre": "Verde y Negro" },
    { "value": "azul", "nombre": "Azul" },
    { "value": "morado", "nombre": "Morado" },
    { "value": "marron", "nombre": "Marrón" },
    { "value": "negro", "nombre": "Negro" }
]

const grados = [
    { "value": "", "nombre": "Sin grados" },
    { "value": "I", "nombre": "I" },
    { "value": "II", "nombre": "I I" },
    { "value": "III", "nombre": "I I I" },
    { "value": "IIII", "nombre": "I I I I" }
]

export class UsuarioController {

    static async getAll(req, res) {
        const usuarios = await UsuarioModel.getAll();
        res.render("usuarios/list", { usuarios });

    }
    static async getById(req, res) {
        const { id } = req.params;
        const [usuario] = await UsuarioModel.getById({ id });
        const asistencias = await AsistenciaModel.getByUserId({ user_id: id });
        console.log(asistencias);
        res.render("usuarios/plantilla", { usuario, asistencias });
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

    static async getUpdate(req, res) {
        const { id } = req.user;
        const item = await UsuarioModel.getById({ id });
        const paises = await ExtraModel.getAllPaises();

        res.render("profile/edit", { item: item[0], paises, grados, cinturones });
    }
    static async getUpdateId(req, res) {
        const { id } = req.params;
        const item = await UsuarioModel.getById({ id });
        const paises = await ExtraModel.getAllPaises();
        res.render("profile/edit", { item: item[0], paises, grados, cinturones });
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
                privilegio,
                genero

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
                privilegio,
                genero
            };
            console.log(newItem);
            const result = await UsuarioModel.update({ input: newItem })
            if (result === false) {
                return res.status(404).json({ message: 'usuario not found' })
            }
            req.flash("success", "usuario modificado correctamente");
            res.redirect("/usuarios/get/" + id);
        } catch (error) {
            console.error(error.code);
            req.flash("error", "Hubo algun error");
            res.redirect("/error");
        }

    }

}