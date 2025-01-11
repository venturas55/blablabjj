import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD

// Base query for users
const usersQuery = `
  SELECT 
    u.id,
    u.usuario,
    u.contrasena,
    u.email,
    u.telefono,
    u.nif,
    u.pais_telefono,
    u.nombre,
    u.apellidos,
    u.cinturon,
    u.grado,
    u.fecha_nacimiento,
    u.peso,
    u.nacionalidad,
    u.privilegio,
    u.pictureURL,
    u.instructor,
    u.genero,
    n.codigo_iso,
    n.nombre as nombre_pais 
  FROM usuarios u 
  LEFT JOIN nacionalidades n ON u.nacionalidad = n.id`;

export const readJSON = (path) => require(path)

export class UsuarioModel {
  static async getAll() {
    const [usuarios] = await db.query(usersQuery);
    return usuarios;
  }

  static async getAllInstructores() {
    const [instructores] = await db.query(usersQuery + ' WHERE u.instructor = true');
    return instructores;
  }

  static async getById({ id }) {
    console.log("UsuarioModel.getById - Input ID:", id);
    try {
      // First try a direct query to see what's in the database
      const checkQuery = "SELECT * FROM usuarios WHERE id = ?";
      const [checkRows] = await db.query(checkQuery, [id]);
      console.log("UsuarioModel.getById - Database check:", {
        query: checkQuery,
        params: [id],
        results: checkRows
      });

      // If we found a user, do the full query
      if (checkRows && checkRows.length > 0) {
        const query = usersQuery + " WHERE u.id = ?";
        const [rows] = await db.query(query, [id]);
        console.log("UsuarioModel.getById - Full query results:", {
          query: query,
          params: [id],
          results: rows
        });

        if (rows && rows.length > 0) {
          console.log("UsuarioModel.getById - User found:", rows[0]);
          return rows[0];
        }
      }
      
      console.log("UsuarioModel.getById - No user found in database");
      return null;
    } catch (error) {
      console.error("UsuarioModel.getById - Error:", error);
      throw error;
    }
  }

  static async getByUsername({ usuario }) {
    console.log("UsuarioModel.getByUsername - Input username:", usuario);
    try {
      // First try a direct query to see what's in the database
      const checkQuery = "SELECT * FROM usuarios WHERE usuario = ?";
      const [checkRows] = await db.query(checkQuery, [usuario]);
      console.log("UsuarioModel.getByUsername - Database check:", {
        query: checkQuery,
        params: [usuario],
        results: checkRows?.length || 0
      });

      // If we found a user, do the full query
      if (checkRows && checkRows.length > 0) {
        const query = usersQuery + " WHERE u.usuario = ?";
        const [rows] = await db.query(query, [usuario]);
        console.log("UsuarioModel.getByUsername - Full query results:", {
          query: query,
          params: [usuario],
          results: rows?.length || 0
        });

        if (rows && rows.length > 0) {
          console.log("UsuarioModel.getByUsername - User found:", {
            id: rows[0].id,
            usuario: rows[0].usuario,
            hasPassword: !!rows[0].contrasena
          });
          return rows[0];
        }
      }
      
      console.log("UsuarioModel.getByUsername - No user found in database");
      return null;
    } catch (error) {
      console.error("UsuarioModel.getByUsername - Error:", error);
      throw error;
    }
  }

  static async create({ input }) {
    try {
      console.log("UsuarioModel.create - Input:", input);
      const [result] = await db.query("INSERT INTO usuarios SET ?", [input]);
      console.log("UsuarioModel.create - Result:", result);
      return result;
    } catch (error) {
      console.error("UsuarioModel.create - Error:", error);
      return false;
    }
  }

  static async delete({ input }) {
    try {
      console.log("UsuarioModel.delete - Input:", input);
      const [result] = await db.query("DELETE FROM usuarios WHERE id = ?", [input]);
      console.log("UsuarioModel.delete - Result:", result);
      return result;
    } catch (error) {
      console.error("UsuarioModel.delete - Error:", error);
      return error;
    }
  }

  static async update({ input }) {
    try {
      console.log("UsuarioModel.update - Input:", input);
      const [result] = await db.query("UPDATE usuarios SET ? WHERE id = ?", [input, input.id]);
      console.log("UsuarioModel.update - Result:", result);
      return result;
    } catch (error) {
      console.error("UsuarioModel.update - Error:", error);
      return error;
    }
  }
}