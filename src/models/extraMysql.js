import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD
export const readJSON = (path) => require(path)


export class ExtraModel {
  static async getAllPaises() {
    var paises = await db.query("select * from nacionalidades");
    return paises;
  }

  static async factcreateFacturacion({ input }) {
    try {
      const a = await db.query("INSERT INTO facturacion set ?", [input]);
      return a;
    } catch (error) {
      console.error(error.code);
      return false;
    }
  }
}