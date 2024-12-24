import funciones from "../lib/funciones.js";
import db from "../database.js";
import { ClaseModel } from '../models/claseMysql.js';
import { UsuarioModel } from '../models/usuarioMysql.js';
import { AsistenciaModel } from '../models/asistenciaMysql.js';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

import { validateClase, validatePartialClase } from '../schemas/validaciones.js';

export class ClaseController {

    static async getAll(req, res) {
        //const usuarios = await UsuarioModel.getAll();
        const clases = await ClaseModel.getAll();
        res.render("clases/list", { clases });
    }

    static async getWeek(req, res) {
        const usuarios = await UsuarioModel.getAll();
        const clases = await ClaseModel.getAll();
        res.render("clases/week", { clases, usuarios });
    }

    static async getClase(req, res) {
        const { id } = req.params;
        /* const usuarios = await UsuarioModel.getAll();
        const actividades = await ActividadModel.getAll(); */
        const asistentes = await AsistenciaModel.getByClaseId({ id: id });
        const clase = await ClaseModel.getById({ id: id })
        var yomismo;
        asistentes.forEach(asistente => {
            if (asistente.usuario_id == req.user.id) {
                asistente.asiste = true;
                yomismo = asistente;
            }
        });
        //console.log(yomismo);
        //console.log(asistentes);
        res.render("clases/plantilla", { item: clase[0], asistentes, yomismo });
    }

    static async getAddClassWeek(req, res) {
        const dias = [{ "id": 1, "dia": "lunes" }, { "id": 2, "dia": "martes" }, { "id": 3, "dia": "miercoles" }, { "id": 4, "dia": "jueves" }, { "id": 5, "dia": "viernes" }, { "id": 6, "dia": "sabado" }, { "id": 7, "dia": "domingo" }];
        try {
            const usuarios = await db.query(" select * from usuarios");
            const actividades = await db.query(" select * from actividades");
            res.render('clases/addClassWeek', { usuarios, actividades, dias });
        } catch (error) {
            console.error(error);
            req.flash("error", "Hubo algun error al intentar añadir la clase " + error);
            res.redirect("/clases/list");
        }
    }

    static async getById(req, res) {
        const { id } = req.params;
        const [clase] = await ClaseModel.getById({ id });
        res.render("clases/plantilla", { clase });
    }

    static async getCreate(req, res) {
        try {
            const usuarios = await db.query(" select * from usuarios");
            const actividades = await db.query(" select * from actividades");
            res.render('clases/add', { usuarios, actividades });
        } catch (error) {
            console.error(error);
            req.flash("error", "Hubo algun error al intentar añadir la clase" + error);
            res.redirect("/clases/list");
        }

    }
    static async create(req, res) {
        const result = validateClase(req.body);

        if (!result.success) {
            // 422 Unprocessable Entity
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        const {
            creador_id,
            actividad_id,
            instructor_id,
            duracion,
            fecha_hora
        } = req.body;

        const item = {
            creador_id,
            actividad_id,
            instructor_id,
            duracion,
            fecha_hora,

        };
        const nuevaACt = await ClaseModel.create({ input: item });
        req.flash("success", "Clase insertada correctamente");
        res.redirect("/clases/list"); //te redirige una vez insertado el item

    }

    static async delete(req, res) {
        const { id } = req.params
        //console.log("deleteclases: " + JSON.stringify(id));
        const result = await ClaseModel.delete({ input: id })
        if (result === false) {
            return res.status(404).json({ message: 'clases not found' })
        }

        req.flash("success", "clases borrado correctamente");
        res.redirect("/clases/list");
    }

    static async deleteAllFutureClass(req, res) {
        
        const result = await ClaseModel.deleteAllFutureClass();
        res.redirect("/calendario/list");
       
    }

    static async getUpdate(req, res) {
        const { id } = req.params;
        const usuarios = await db.query(" select * from usuarios");
        const actividades = await db.query(" select * from actividades");
        const item = await db.query("SELECT * FROM clases c LEFT JOIN actividades a ON c.actividad_id = a.actividad_id WHERE c.clase_id=?", [id,]);
        res.render("clases/edit", { item: item[0], actividades, usuarios });
    }

    static async update(req, res) {
        const result = validatePartialClase(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const { id } = req.params;
        try {
            const {
                creador_id,
                actividad_id,
                instructor_id,
                duracion,
                fecha_hora
            } = req.body;


            const newItem = {
                clase_id: id,
                creador_id,
                actividad_id,
                instructor_id,
                duracion,
                fecha_hora
            };
            //console.log(newItem);
            const result = await ClaseModel.update({ input: newItem })
            if (result === false) {
                return res.status(404).json({ message: 'Clase not found' })
            }
            //req.flash("success", "Clase modificada correctamente");
            res.redirect("/clases/list");
        } catch (error) {
            console.error(error.code + " " + error.message);
            //req.flash("error", "Hubo algun error");
            res.redirect("/error");
        }

    }

}