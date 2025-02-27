import { WeekModel } from '../models/weekMysql.js';
import { ClaseModel } from '../models/claseMysql.js';
import { UsuarioModel } from '../models/usuarioMysql.js';
import { ActividadModel } from '../models/actividadMysql.js';
import funciones from '../lib/funciones.js';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

import { validateClase, validatePartialClase } from '../schemas/validaciones.js';

export class WeekController {

    static async getAll(req, res) {
        const usuarios = await UsuarioModel.getAll();
        const clases = await WeekModel.getAll();
        const actividades = await ActividadModel.getAll();
        //console.log("clases: ",clases);
        // Ordenar las clases por fecha
        const clasesOrdenadas = clases.sort((a, b) => (a.dia) - (b.dia));
        // Agrupar las clases por día de la semana (Lunes=1, ..., Domingo=7)
        const clasesPorDia = [[], [], [], [], [], [], []]; // Array para los 7 días
        //console.log("clasesOrdenadas: ",clasesOrdenadas[5]);
        clasesOrdenadas.forEach((clase) => {
            //console.log("clase.dia: ",clase);
            clasesPorDia[clase.dia - 1].push(clase);
        });

        // Asegurar que cada día también esté ordenado (redundante si ya está ordenado antes del agrupamiento)
        clasesPorDia.forEach((clasesDelDia) => {
            clasesDelDia.sort((a, b) => {
                // Convertir la hora a un formato comparable (como cadenas de tiempo)
                const horaA = a.hora.split(':').map(Number); // [HH, MM, SS]
                const horaB = b.hora.split(':').map(Number);
                
                // Comparar primero horas, luego minutos, luego segundos
                if (horaA[0] !== horaB[0]) return horaA[0] - horaB[0]; // Comparar horas
                if (horaA[1] !== horaB[1]) return horaA[1] - horaB[1]; // Comparar minutos
                return horaA[2] - horaB[2]; // Comparar segundos (opcional si tu formato incluye segundos)
            });
        });
        //console.log(clasesPorDia);
        res.render("week/list", { clases: clasesPorDia, usuarios,actividades,dias:funciones.dias });
    }

    static async getById(req, res) {
        const { id } = req.params;
        const [clase] = await WeekModel.getById({ id });
        console.log(clase);
        res.render("week/plantilla", { clase });
    }

/*     static async getCreate(req, res) {
         try {
           const usuarios = await UsuarioModel.getAll();
           const actividades = await ActividadModel.getAll();
           res.render('week/add', { usuarios, actividades, dias:funciones.dias  });
         } catch (error) {
           console.error(error);
           req.flash("error", "Hubo algun error al intentar añadir la clase " + error);
           res.redirect("/week/list");
         }
    } */
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
            dia,
            hora
        } = req.body;

        const item = {
            creador_id,
            actividad_id,
            instructor_id,
            duracion,
            dia,
            hora

        };
        const nuevaACt = await WeekModel.createClass({ input: item });
        req.flash("success", "Clase semanal insertada correctamente");
        res.redirect("/week/list"); //te redirige una vez insertado el item

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
        const nuevaACt = await WeekModel.create({ input: item });
        req.flash("success", "Clase insertada correctamente");
        res.redirect("/clases/list"); //te redirige una vez insertado el item

    }

    static async cloneWeek(req, res) {
        const del = await ClaseModel.delete3m();
        const nuevaACt = await WeekModel.cloneWeek({ input: "item" });
        req.flash("success", "Clases insertadas correctamente ");
        res.redirect("/week/list"); //te redirige una vez insertado el item
    }   
    
    static async delete(req, res) {
        const { id } = req.params
        const result = await WeekModel.delete({ input: id })
        if (result === false) {
            return res.status(404).json({ message: 'clases not found' })
        }

        req.flash("success", "clase borrada correctamente");
        res.redirect("/week/list");
    }

    static async getUpdate(req, res){
        const { id } = req.params;
        const usuarios = await UsuarioModel.getAll();
        const actividades = await ActividadModel.getAll();
        const [item] = await WeekModel.getClaseSemana({id});
        console.log(item);
        res.render("week/edit", { item, actividades, usuarios,dias:funciones.dias });


    }
    static async update(req, res) {
     /*    const result = validatePartialClase(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        } */

        const { id } = req.params;
        try {
            const {
                creador_id,
                actividad_id,
                instructor_id,
                dia,
                hora,
                duracion
            } = req.body;


            const newItem = {
                clase_id: id,
                creador_id,
                actividad_id,
                instructor_id,
                dia,
                hora,
                duracion
            };
            console.log(newItem);
            const result = await WeekModel.update({ input: newItem })
            if (result === false) {
                return res.status(404).json({ message: 'Clase not found' })
            }
            req.flash("success", "Clase modificada correctamente");
            res.redirect("/week/list");
        } catch (error) {
            console.error(error.code + " " + error);
            //req.flash("error", "Hubo algun error");
            res.redirect("/error");
        }

    }

}