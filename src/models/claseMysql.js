import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD
const sqlSelectQueryActivity = "SELECT c.clase_id,c.creador_id,c.actividad_id,c.instructor_id,c.duracion,c.fecha_hora,c.salario_propuesto,c.created_at,ui.nombre as nombre_instructor,ui.apellidos as apellidos_instructor,ui.email as email_instructor,ui.telefono as telefono_instructor,ui.pictureURL as pictureURL_instructor,uc.nombre as nombre_creador,uc.apellidos as apellidos_creador,uc.email as email_creador,uc.telefono as telefono_creador,uc.pictureURL as pictureURL_creador,a.nombre as nombre_actividad, a.descripcion as descripcion_actividad, a.pictureURL as pictureURL_actividad from clases c LEFT JOIN usuarios ui ON c.instructor_id = ui.id LEFT JOIN usuarios uc ON c.creador_id=uc.id LEFT JOIN actividades a ON c.actividad_id=a.actividad_id"
export const readJSON = (path) => require(path)


export class ClaseModel {
  static async getAll() {
    const clases = await db.query(sqlSelectQueryActivity);
    return clases;
  }

  static async getById({ id }) {
    const clase = await db.query(sqlSelectQueryActivity+" where actividad_id=?", id);
    return clase;
  }

  static async getWeek({  }) {
    const week = await db.query("select * from clases where fecha_hora <'1970-01-12",);
    return week;
  }

  static async writeWeek({ input }) {
    try {
      console.log(input);
      const a = await db.query("INSERT INTO clases set ?", [input]);
      return a;
    } catch (error) {
      console.error(error.code);
      return false;
    }
  }

  static async create({ input }) {
    try {
      console.log(input);
      const a = await db.query("INSERT INTO clases set ?", [input]);
      return a;
    } catch (error) {
      console.error(error.code);
      return false;
    }

  }
  static async delete({ input }) {
    try {
      await db.query("DELETE FROM clases WHERE clase_id=?", [input]);
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }

  static async update({ input }) {
    try {
      await db.query("UPDATE clases set ? WHERE clase_id = ?", [input, input.clase_id,]);
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }
  static async delete3m({ input }) {
    try {
      await db.query('DELETE FROM clases WHERE fecha_hora >= CURDATE() + INTERVAL (7 - WEEKDAY(CURDATE())) DAY  AND fecha_hora < CURDATE() + INTERVAL (7 - WEEKDAY(CURDATE())) DAY + INTERVAL 3 MONTH');
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }

}