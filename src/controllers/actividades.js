import { ActividadModel } from '../models/actividadMysql.js';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

import { validateActividad, validatePartialActividad } from '../schemas/validaciones.js';

export class ActividadController {

    static async getAll(req, res) {
        const { genre } = req.query
        const actividades = await ActividadModel.getAll();
        res.render("actividades/list", { actividades });

    }
    static async getById(req, res) {
        const { id } = req.params;
        const [actividad] = await ActividadModel.getById({ id });
        console.log(actividad);
        res.render("actividades/plantilla", { actividad });
    }

    static async create(req, res) {
        const result = validateActividad(req.body);

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
        const nuevaACt = await ActividadModel.create({ input: item });
        req.flash("success", "Actividad insertado correctamente");
        res.redirect("/actividades/list"); //te redirige una vez insertado el item

    }

    static async delete(req, res) {
        const { id } = req.params
        console.log("deleteActividad: " + JSON.stringify(id));
        const result = await ActividadModel.delete({ input: id })
        if (result === false) {
            return res.status(404).json({ message: 'Actividad not found' })
        }

        //req.flash("success", "Actividad borrado correctamente");
        res.redirect("/actividades/list");
    }

    static async update(req, res) {
        /*  const result = validatePartialMovie(req.body)
 
         if (!result.success) {
             return res.status(400).json({ error: JSON.parse(result.error.message) })
         } */

        const { id } = req.params;
        try {
            const {
                nombre,
                descripcion,
                pictureURL
            } = req.body;
            if (typeof req.file !== 'undefined') {
                pictureURL = req.file.filename;
            }
            const newItem = {
                actividad_id: id,
                nombre,
                descripcion,
                pictureURL,
            };
            console.log(newItem);
            console.log(req.file);
            const result = await ActividadModel.update({ input: newItem })
            if (result === false) {
                return res.status(404).json({ message: 'Actividad not found' })
            }
            //req.flash("success", "Actividad modificada correctamente");
            res.redirect("/actividades/list");
        } catch (error) {
            console.error(error.code);
            //req.flash("error", "Hubo algun error");
            res.redirect("/error");
        }

    }

}