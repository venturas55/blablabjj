import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD

export const readJSON = (path) => require(path)


export class UsuarioModel {
  static async getAll() {
    const usuarios = await db.query('SELECT * from usuarios');
    return usuarios;
  }

  static async getAllInstructores() {
    const instructores = await db.query('SELECT * from usuarios where instructor=true');
    return instructores;
  }


  static async getById({ id }) {
    const usuario = await db.query("SELECT * FROM usuarios where id=?", id);
    return usuario;
  }

  static async create({ input }) {
    try {
      const a = await db.query("INSERT INTO usuarios set ?", [input]);
      return a;
    } catch (error) {
      console.error(error.code);
      return false;
    }

  }
  static async delete({ input }) {
    try {
      await db.query("DELETE FROM usuarios WHERE id=?", [input]);
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }

  static async update({ input }) {
    try {
      await db.query("UPDATE usuarios set ? WHERE id = ?", [input, input.id,]);
    } catch (error) {
      console.error(error.code + error.message);
      return error;
    }
  }
}