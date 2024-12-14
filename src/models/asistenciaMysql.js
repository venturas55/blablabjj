import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD

const AsistenciasQuery = "select a.asistencia_id,a.clase_id,a.usuario_id,c.instructor_id,c.actividad_id,c.fecha_hora,c.duracion,act.nombre as nombre_actividad,act.descripcion as descripcion_actividad,act.pictureURL as pictureURL_actividad,ui.nombre as nombre_instructor,ui.apellidos as apellidos_instructor,ui.pictureURL as pictureURL_instructor,uu.nombre as nombre_usuario,uu.apellidos as apellidos_usuario, uu.pictureURL as pictureURL_usuario,uc.nombre as nombre_creador, uc.apellidos as apellidos_creador,uc.pictureURL as pictureURL_creador from asistencias a LEFT JOIN clases c on a.clase_id=c.clase_id LEFT JOIN actividades act on c.actividad_id=act.actividad_id LEFT JOIN usuarios ui on c.instructor_id=ui.id LEFT JOIN usuarios uu on uu.id=a.usuario_id LEFT JOIN usuarios uc on uc.id=c.creador_id";

export const readJSON = (path) => require(path)


export class AsistenciaModel {
  static async getAll({input}) {
    let asistencias = await db.query(AsistenciasQuery);
    console.log(asistencias);
    return asistencias;
  }

  static async getById({ id }) {
    const actividad = await db.query("SELECT * FROM asistencias where asistencia_id=?", id);
    return actividad;
  }

  static async create({ input }) {
    try {
     // console.log(input);
      const a = await db.query("INSERT INTO asistencias set ?", [input]);
      return a;
    } catch (error) {
      console.error(error.code);
      return false;
    }

  }
  static async delete({ input }) {
    try {
      await db.query("DELETE FROM asistencias WHERE asistencia_id=?", [input]);
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }

  /*  static async update({ input }) {
     try {
       console.log("UPDATE asistencias" + input);
       await db.query("UPDATE asistencias set ? WHERE asistencia_id = ?", [input, input.asistencia_id,]);
     } catch (error) {
       console.error(error.code);
       return error;
     }
   } */
}