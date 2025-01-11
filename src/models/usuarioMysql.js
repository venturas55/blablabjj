import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD
const usersQuery = "SELECT u.id,u.usuario,u.contrasena,u.email,u.telefono,u.nif,u.pais_telefono,u.nombre,u.apellidos,u.cinturon,u.grado,u.fecha_nacimiento,u.peso,u.nacionalidad,u.privilegio,u.pictureURL,u.instructor,u.genero,n.codigo_iso,n.nombre as nombre_pais FROM usuarios u LEFT JOIN nacionalidades n ON u.nacionalidad = n.id"

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
    console.log("UsuarioModel.getById - Input ID:", id);
    try {
      // Log the exact query being executed
      const query = usersQuery + " where u.id = ?";
      const params = [id];
      console.log("UsuarioModel.getById - Query:", query);
      console.log("UsuarioModel.getById - Params:", params);

      // Execute the query and get results
      const [rows] = await db.query(query, params);
      console.log("UsuarioModel.getById - Raw results:", rows);

      // Return the first user if found
      if (Array.isArray(rows) && rows.length > 0) {
        console.log("UsuarioModel.getById - User found:", rows[0]);
        return rows[0];
      }
      
      console.log("UsuarioModel.getById - No user found");
      return null;
    } catch (error) {
      console.error("UsuarioModel.getById - Error:", error);
      throw error;
    }
  }

  static async create({ input }) {
    try {
      const result = await db.query("INSERT INTO usuarios set ?", [input]);
      return result;
    } catch (error) {
      console.error(error.code);
      return false;
    }
  }

  static async delete({ input }) {
    try {
      const result = await db.query("DELETE FROM usuarios WHERE id=?", [input]);
      return result;
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }

  static async update({ input }) {
    try {
      const result = await db.query("UPDATE usuarios set ? WHERE id = ?", [input, input.id]);
      return result;
    } catch (error) {
      console.error(error.code + error.message);
      return error;
    }
  }
}