import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD
export const readJSON = (path) => require(path)


export class ExtraModel {
  static async getAllPaises() {
    var paises = await db.query("select * from nacionalidades");
    return paises;
  }

}