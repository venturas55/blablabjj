import { ClaseModel } from '../models/claseMysql.js';
import { UsuarioModel } from '../models/usuarioMysql.js';
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
        res.render("clases/week", { clases,usuarios });
    }
    static async getById(req, res) {
        const { id } = req.params;
        const [clase] = await ClaseModel.getById({ id });
        console.log(clase);
        res.render("clases/plantilla", { clase });
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

    static async addClassWeek(req, res) {
        const result = validateClase(req.body);

        if (!result.success) {
            // 422 Unprocessable Entity
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        const {
            creador_id,
            actividad_id,
            dia,
            hora,
            duracion,
            instructor_id
            
        } = req.body;
        console.log(req.body);
        
        const item = {
            creador_id,
            actividad_id,
            instructor_id,
            duracion,
            "fecha_hora": "1970-1-5T"+hora,

        };
        const nuevaACt = await ClaseModel.create({ input: item });
        req.flash("success", "Clase insertada correctamente");
        res.redirect("/clases/week"); //te redirige una vez insertado el item

    }

    static async duplicateWeek(req, res) {
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

    static async cloneWeek(req, res) {
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
        console.log("deleteclases: " + JSON.stringify(id));
        const result = await ClaseModel.delete({ input: id })
        if (result === false) {
            return res.status(404).json({ message: 'clases not found' })
        }

        //req.flash("success", "clases borrado correctamente");
        res.redirect("/clases/list");
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
            console.log(newItem);
            const result = await ClaseModel.update({ input: newItem })
            if (result === false) {
                return res.status(404).json({ message: 'Clase not found' })
            }
            //req.flash("success", "Clase modificada correctamente");
            res.redirect("/clases/list");
        } catch (error) {
            console.error(error.code + " "+ error.message);
            //req.flash("error", "Hubo algun error");
            res.redirect("/error");
        }

    }

}