import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD
export const readJSON = (path) => require(path)


export class MembresiaModel {
    static async createMembresia(input) {
        try {
          const a = await db.query("INSERT INTO membresias set ?", [input]);
          return a;
        } catch (error) {
          console.error(error.code + ": " + error.message);
          console.error(error);
          return false;
        }
      }
    
      static async updateMembresia(input) {
        try {
          const a = await db.query("UPDATE membresias set ? WHERE id = ?", [input]);
          return a;
        } catch (error) {
          console.error(error.code + ": " + error.message);
          console.error(error);
          return false;
        }
      }
    
      static async getMembresias() {
        try {
          const cliente = await db.query("SELECT * FROM membresias ");
          return clientes;
        } catch (error) {
          console.error(error.code + ": " + error.message);
          console.error(error);
          return false;
        }
      }
    
      static async getMembresiaByUserId(id) {
        try {
          const cliente = await db.query("SELECT * FROM membresias where usuario_id=?", id);
          return cliente;
        } catch (error) {
          console.error(error.code + ": " + error.message);
          console.error(error);
          return false;
        }
      }
    
      static async getMembresiaByCostumerId(customer_id) {
        try {
          const cliente = await db.query("SELECT * FROM membresias where customer_id=?", customer_id);
          return cliente;
        } catch (error) {
          console.error(error.code + ": " + error.message);
          console.error(error);
          return false;
        }
      }

      static async getMembresiaByEmail(email) {
        try {
          const cliente = await db.query("SELECT * FROM membresias where correo=?", email);
          return cliente;
        } catch (error) {
          console.error(error.code + ": " + error.message);
          console.error(error);
          return false;
        }
      }

}