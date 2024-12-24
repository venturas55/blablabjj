import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD
export const readJSON = (path) => require(path)


export class ExtraModel {
  static async getAllPaises() {
    try {
      var paises = await db.query("select * from nacionalidades");
      return paises;
    } catch (error) {
      console.error(error.code + ": " + error.message);
      console.error(error);
      return false;
    }
  }

  static async deleteProducts( ) {
    try {
      console.log(input);
      const a = await db.query("delete from stripe_products");
      return a;
    } catch (error) {
      console.error(error.code + " : " + error.message);
      return false;
    }

  }
 static async insertProducts( input) {
    try {
      console.log(input);
      const a = await db.query("INSERT INTO stripe_products (nombre,descripcion,product_id,price_id) values ?", [input]);
      return a;
    } catch (error) {
      console.error(error.code + " : " + error.message);
      return false;
    }

  }

 
}