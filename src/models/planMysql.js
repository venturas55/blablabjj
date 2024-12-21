import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD

export const readJSON = (path) => require(path)



export class PlanModel {
  static async getAll() {
    const actividades = await db.query('SELECT * from planes');
    return actividades;
  }

  static async getById({ id }) {
    const actividad = await db.query("SELECT * FROM planes where plan_id=?", id);
    return actividad;
  }

  static async create({ input }) {
    try {
      const a = await db.query("INSERT INTO planes set ?", [input]);
      return a;
    } catch (error) {
      console.error(error.code);
      return false;
    }

  }
  static async delete({ input }) {
    try {
      await db.query("DELETE FROM planes WHERE plan_id=?", [input]);
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }

  static async update({ input }) {
    try {
      await db.query("UPDATE planes set ? WHERE plan_id = ?", [input, input.plan_id,]);
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }
}