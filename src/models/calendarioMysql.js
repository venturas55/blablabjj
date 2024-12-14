import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD
const SQLquery = "select * from clases";
const sqlSelectQueryActivity = "SELECT c.clase_id,c.creador_id,c.actividad_id,c.instructor_id,c.duracion,c.fecha_hora,c.salario_propuesto,c.created_at,ui.nombre as nombre_instructor,ui.apellidos as apellidos_instructor,ui.email as email_instructor,ui.telefono as telefono_instructor,ui.pictureURL as pictureURL_instructor,uc.nombre as nombre_creador,uc.apellidos as apellidos_creador,uc.email as email_creador,uc.telefono as telefono_creador,uc.pictureURL as pictureURL_creador,a.nombre as nombre_actividad, a.descripcion as descripcion_actividad, a.pictureURL as pictureURL_actividad from clases c LEFT JOIN usuarios ui ON c.instructor_id = ui.id LEFT JOIN usuarios uc ON c.creador_id=uc.id LEFT JOIN actividades a ON c.actividad_id=a.actividad_id"


export const readJSON = (path) => require(path)


export class CalendarioModel {

  static async getAll() {
    //Calendario tiene que ser un listado de las clases con toda la info y con los asistentes de cada clase.
    const calendario = await db.query(sqlSelectQueryActivity);
    return calendario;
  }

  static async getAll3m() {
    //Calendario tiene que ser un listado de las clases con toda la info y con los asistentes de cada clase.
    const calendario = await db.query(sqlSelectQueryActivity + " WHERE c.fecha_hora >= DATE_FORMAT(CURDATE(), '%Y-%m-01') AND c.fecha_hora < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 3 MONTH), '%Y-%m-01') order by c.fecha_hora asc");
    return calendario;
  }

  static async getById({ id }) {
    const actividad = await db.query("SELECT * FROM actividades where actividad_id=?", id);
    return actividad;
  }

  static async create({ input }) {
    try {
      const a = await db.query("INSERT INTO actividades set ?", [input]);
      return a;
    } catch (error) {
      console.error(error.code);
      return false;
    }

  }
  static async delete({ input }) {
    try {
      await db.query("DELETE FROM actividades WHERE actividad_id=?", [input]);
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }

  static async update({ input }) {
    try {
      await db.query("UPDATE actividades set ? WHERE actividad_id = ?", [input, input.actividad_id,]);
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }
}