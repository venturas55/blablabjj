import { CalendarioModel } from '../models/calendarioMysql.js';
import { AsistenciaModel } from '../models/asistenciaMysql.js';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createRequire } from 'node:module';
import moment from 'moment';
const require = createRequire(import.meta.url);
import { validateCalendario, validatePartialCalendario } from '../schemas/validaciones.js';


export class CalendarioController {
    static async getAll(req, res) {
        let input = "";
        const [rows] = await CalendarioModel.getAll(input);
        const clases = rows.reduce((acc, row) => {
            const clase = acc.find(c => c.clase_id === row.clase_id);
            if (clase) {
                clase.asistencias.push({
                    asistencia_id: row.asistencia_id,
                    usuario_id: row.usuario_id,
                    nombre: row.usuario_nombre,
                    apellidos: row.usuario_apellidos,
                    email: row.usuario_email,
                    telefono: row.usuario_telefono,
                    pictureURL: row.usuario_pictureURL,
                    cinturon: row.cinturon,
                    grado: row.grado
                });
            } else {
                acc.push({
                    clase_id: row.clase_id,
                    creador_id: row.creador_id,
                    actividad_id: row.actividad_id,
                    instructor_id: row.instructor_id,
                    duracion: row.duracion,
                    fecha_hora: row.fecha_hora,
                    salario_propuesto: row.salario_propuesto,
                    created_at: row.created_at,
                    nombre_actividad: row.nombre_actividad,
                    nombre_instructor: row.nombre_instructor,
                    apellidos_instructor: row.apellidos_instructor,
                    email_instructor: row.email_instructor,
                    pictureURL_instructor: row.pictureURL_instructor,
                    asistencias: row.asistencia_id ? [{
                        asistencia_id: row.asistencia_id,
                        usuario_id: row.usuario_id,
                        nombre: row.usuario_nombre,
                        apellidos: row.usuario_apellidos,
                        email: row.usuario_email,
                        telefono: row.usuario_telefono,
                        pictureURL_usuario: row.usuario_pictureURL,
                        cinturon: row.cinturon,
                        grado: row.grado
                    }] : []
                });
            }
            return acc;
        }, []);

        //======= PARA EL CALENDARIOS =================================

        const currentDate = req.query.date ? moment(req.query.date) : moment();
        const startOfMonth = currentDate.clone().startOf('month').startOf('isoWeek');
        const endOfMonth = currentDate.clone().endOf('month').endOf('isoWeek');

        const dias = [];
        let day = startOfMonth;
        while (day.isBefore(endOfMonth)) {
            dias.push({
                day: day.date(),
                fullDate: day.format('YYYY-MM-DD'),
            });
            day.add(1, 'day');
        }
        //======= FIN PARA EL CALENDARIO =================================


        res.render("calendario/list", { layout: 'withcalendar', clases, mes: currentDate.format('MMMM'), anio: currentDate.format('YYYY'), dias });
    }


    static async getById(req, res) {
        const { anuncio_id } = req.params
        const [item] = await CalendarioModel.getById({ id: anuncio_id });
        //console.log(item);
        res.render("anuncios/plantilla", { item });
    }
    static async create(req, res) {
        const { clase_id } = req.params
        const item = {
            clase_id,
            usuario_id: req.user.id,
        };
        //console.log(item);
        //const solicitudes = await CalendarioModel.getAll({ monitor_id: item.monitor_id });
        const a = await CalendarioModel.create({ input: item });
        req.flash("success", "Solicitud realizada correctamente");
        res.redirect("/asistencias/list"); //te redirige una vez insertado el item

    }
    static async delete(req, res) {
        const { asistencia_id } = req.params
        const result = await CalendarioModel.delete({ input: asistencia_id })
        if (result === false) {
            return res.status(404).json({ message: 'Asistencia not found' })
        }
        //req.flash("success", "Actividad borrado correctamente");
        res.redirect("/asistencias/list");
    }
    static async update(req, res) {
        /*  const result = validatePartialMovie(req.body)
 
         if (!result.success) {
             return res.status(400).json({ error: JSON.parse(result.error.message) })
         } */

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
        //console.log(anuncio_id);
        //console.log(item);
        const result = await CalendarioModel.update({ input: item })
        if (result === false) {
            return res.status(404).json({ message: 'anuncio not found' })
        }
        //req.flash("success", "Actividad modificada correctamente");
        res.redirect("/anuncios/list");
    } catch(error) {
        console.error(error.code);
        //req.flash("error", "Hubo algun error");
        res.redirect("/error");
    }

}
