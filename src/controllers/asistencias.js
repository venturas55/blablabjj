import { AsistenciaModel } from '../models/asistenciaMysql.js';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { validateAsistencia, validatePartialAsistencia } from '../schemas/validaciones.js';


export class AsistenciaController {
    static async getAll(req, res) {
        const {asistencias,ranking} = await AsistenciaModel.getAll();
        console.log(ranking);
        res.render("asistencias/list", { asistencias,ranking });
    }

    static async getById(req, res) {
        const { id } = req.params
        const asistencias = await AsistenciaModel.getById(id);
        res.render("asistencias/list", { asistencias, });
    }

    static async getByUserId(req, res) {
        const { user_id } = req.params
        const asistencias = await AsistenciaModel.getByUserId(user_id);
        res.render("asistencias/list", { asistencias, });
    }


    static async confirmById(req, res) {
        const { asistencia_id, clase_id } = req.body
        console.log(asistencia_id + " " + clase_id);
        const item = await AsistenciaModel.confirmById({ asistencia_id });
        res.redirect("/clases/ver/" + clase_id);
    }

    static async cancelById(req, res) {
        const { asistencia_id, clase_id } = req.body
        const item = await AsistenciaModel.cancelById({ asistencia_id });
        res.redirect("/clases/ver/" + clase_id);
    }

    static async create(req, res) {
        const { clase_id } = req.params
        const item = {
            clase_id,
            usuario_id: req.user.id,
            cinturon: req.user.cinturon,
            grado: req.user.grado
        };
        const a = await AsistenciaModel.create({ input: item });
        req.flash("success", "Solicitud realizada correctamente");
        res.redirect("/clases/ver/" + clase_id); //te redirige una vez insertado el item

    }
    static async delete(req, res) {
        const { asistencia_id } = req.params
        const [clase] = await AsistenciaModel.getById({ id: asistencia_id })
        const result = await AsistenciaModel.delete({ input: asistencia_id })
        if (result === false) {
            return res.status(404).json({ message: 'Asistencia not found' })
        }
        req.flash("success", "Actividad borrado correctamente");
        res.redirect("/clases/ver/" + clase.clase_id); //te redirige una vez insertado el item
    }

    static async getUpdate(req, res) {
        const { asistencia_id } = req.params;
        const [item] = await db.query("SELECT * FROM asistencias WHERE asistencia_id=?", [asistencia_id,]);
        res.render("asistencias/list", { item });
    }
    static async update(req, res) {
        /*  const result = validatePartialMovie(req.body)
 
         if (!result.success) {
             return res.status(400).json({ error: JSON.parse(result.error.message) })
         } */
        try {

            const { anuncio_id } = req.params;
            const {
                actividad_ofrecida_id,
                duracion,
                fecha_hora,
                salario_propuesto,
            } = req.body;
            const item = {
                anuncio_id,
                actividad_ofrecida_id,
                duracion,
                fecha_hora,
                salario_propuesto,
                creador_id: req.user.id
            };
            console.log(anuncio_id);
            console.log(item);
            const result = await AsistenciaModel.update({ input: item })
            if (result === false) {
                return res.status(404).json({ message: 'anuncio not found' })
            }
            //req.flash("success", "Actividad modificada correctamente");
            res.redirect("/anuncios/list");
        } catch (error) {
            console.error(error.code);
            //req.flash("error", "Hubo algun error");
            res.redirect("/error");
        }

    }
}
