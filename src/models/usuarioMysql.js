import db from '../database.js';

// Base query for users
const usersQuery = `
  SELECT 
    u.*,
    n.codigo_iso,
    n.nombre as nombre_pais 
  FROM usuarios u 
  LEFT JOIN nacionalidades n ON u.nacionalidad = n.id`;

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
    try {
      // Use the full user query with joins
      const [rows] = await db.query(
        `${usersQuery} WHERE u.id = ?`,
        [id]
      );
      
      // With mysql2/promise, rows is already the array of results
      const found = Array.isArray(rows) && rows.length > 0;
      const user = found ? rows[0] : null;
      
      if (!found || !user) {
        console.log("UsuarioModel.getById - No user found");
        return null;
      }

      //console.log("UsuarioModel.getById - User found:", { id: user.id, usuario: user.usuario });
      return user;
    } catch (error) {
      console.error("UsuarioModel.getById - Error:", error);
      throw error;
    }
  }

  static async getByGoogleId({ id }) {
    try {
      const [rows] = await db.query(
        `${usersQuery} WHERE u.google_id = ?`,
        [id]
      );
      
      // With mysql2/promise, rows is already the array of results
      const found = Array.isArray(rows) && rows.length > 0;
      const user = found ? rows[0] : null;
      
      if (!found || !user) {
        console.log("UsuarioModel.getById - No user found");
        return null;
      }

      console.log("UsuarioModel.getById - User found:", { google_id: user.google_id, usuario: user.usuario });
      return user;
    } catch (error) {
      console.error("UsuarioModel.getById - Error:", error);
      throw error;
    }
  }

  static async getByUsername({ usuario }) {
    //console.log("UsuarioModel.getByUsername - Input username:", usuario);
    try {
      const query = usersQuery + " WHERE u.usuario = ?";
      const [rows] = await db.query(query, [usuario]);
      
      if (!rows || rows.length === 0) {
        console.log("UsuarioModel.getByUsername - No user found");
        return null;
      }

      const user = rows[0];
      console.log("UsuarioModel.getByUsername - Found user:", { 
        id: user.id, 
        usuario: user.usuario 
      });
      
      return user;
    } catch (error) {
      console.error("UsuarioModel.getByUsername - Error:", error);
      throw error;
    }
  }

  static async create( input ) {
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