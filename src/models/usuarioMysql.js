import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD
const usersQuery = "SELECT u.id,u.usuario,u.contrasena,u.email,u.telefono,u.nif,u.pais_telefono,u.nombre,u.apellidos,u.cinturon,u.grado,u.fecha_nacimiento,u.peso,u.nacionalidad,u.privilegio,u.pictureURL,u.instructor,n.codigo_iso,n.nombre as nombre_pais FROM usuarios u LEFT JOIN nacionalidades n ON u.nacionalidad = n.id"

export const readJSON = (path) => require(path)


export class UsuarioModel {
  static async getAll() {
    const usuarios = await db.query(usersQuery);
    return usuarios;
  }

  static async getAllInstructores() {
    const instructores = await db.query(usersQuery+' where u.instructor=true');
    return instructores;
  }


  static async getById({ id }) {
    const usuario = await db.query(usersQuery+" where u.id=?", id);
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