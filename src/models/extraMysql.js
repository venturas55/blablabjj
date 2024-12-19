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

  static async createFacturacion(input) {
    try {
      const a = await db.query("INSERT INTO facturacion set ?", [input]);
      return a;
    } catch (error) {
      console.error(error.code + ": " + error.message);
      console.error(error);
      return false;
    }
  }

  static async updateFacturacion(input, id) {
    try {
      const a = await db.query("UPDATE facturacion set ? WHERE id = ?", [input, id,]);
      return a;
    } catch (error) {
      console.error(error.code + ": " + error.message);
      console.error(error);
      return false;
    }
  }

  static async getSubscriptions() {
    try {
      const cliente = await db.query("SELECT * FROM facturacion ");
      return clientes;
    } catch (error) {
      console.error(error.code + ": " + error.message);
      console.error(error);
      return false;
    }
  }

  static async getFacturacionByUserId(id) {
    try {
      const cliente = await db.query("SELECT * FROM facturacion where usuario_id=?", id);
      return cliente;
    } catch (error) {
      console.error(error.code + ": " + error.message);
      console.error(error);
      return false;
    }
  }
}