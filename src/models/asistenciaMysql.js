import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD

const AsistenciasQuery = "select a.asistencia_id,a.asistencia,a.clase_id,a.usuario_id,c.instructor_id,c.actividad_id,c.fecha_hora,c.duracion,act.nombre as nombre_actividad,act.descripcion as descripcion_actividad,act.pictureURL as pictureURL_actividad,uu.nombre as nombre_usuario,uu.apellidos as apellidos_usuario, uu.pictureURL as pictureURL_usuario,uu.nacionalidad,uu.genero,nac.codigo_iso,nac.nombre as pais_nombre,a.cinturon,a.grado  from asistencias a LEFT JOIN clases c on a.clase_id=c.clase_id LEFT JOIN actividades act on c.actividad_id=act.actividad_id  LEFT JOIN usuarios uu on uu.id=a.usuario_id LEFT JOIN nacionalidades nac on nac.id=uu.nacionalidad";
const rankingQuery = "select a.asistencia_id,a.asistencia,a.clase_id,a.usuario_id,c.instructor_id,c.actividad_id,c.fecha_hora,c.duracion,act.nombre as nombre_actividad,act.descripcion as descripcion_actividad,act.pictureURL as pictureURL_actividad,uu.nombre as nombre_usuario,uu.apellidos as apellidos_usuario, uu.pictureURL as pictureURL_usuario,uu.nacionalidad,uu.genero,nac.codigo_iso,nac.nombre as pais_nombre,a.cinturon,a.grado, COUNT(a.asistencia_id) AS total_asistencias from asistencias a LEFT JOIN clases c on a.clase_id=c.clase_id LEFT JOIN actividades act on c.actividad_id=act.actividad_id  LEFT JOIN usuarios uu on uu.id=a.usuario_id LEFT JOIN nacionalidades nac on nac.id=uu.nacionalidad where a.asistencia=1 GROUP BY a.usuario_id order by total_asistencias desc";

export const readJSON = (path) => require(path)

export class AsistenciaModel {
  static async getAll() {
    try {
      const [asistencias] = await db.query(AsistenciasQuery);
      const [ranking] = await db.query(rankingQuery);
      return { asistencias, ranking };
    } catch (error) {
      console.error("AsistenciaModel.getAll - Error:", error);
      throw error;
    }
  }

  static async getById({ id }) {
    try {
      console.log("AsistenciaModel.getById - ID:", id);
      const [rows] = await db.query(AsistenciasQuery + " where a.asistencia_id=?", [id]);
      console.log("AsistenciaModel.getById - Result:", rows);
      return rows;
    } catch (error) {
      console.error("AsistenciaModel.getById - Error:", error);
      throw error;
    }
  }

  static async getByUserId({ user_id }) {
    try {
      console.log("AsistenciaModel.getByUserId - User ID:", user_id);
      const [rows] = await db.query(AsistenciasQuery + " where a.usuario_id=?", [user_id]);
      console.log("AsistenciaModel.getByUserId - Results count:", rows?.length || 0);
      return rows;
    } catch (error) {
      console.error("AsistenciaModel.getByUserId - Error:", error);
      throw error;
    }
  }

  static async getByClaseId({ id }) {
    try {
      console.log("AsistenciaModel.getByClaseId - Class ID:", id);
      const [rows] = await db.query(AsistenciasQuery + " where a.clase_id=?", [id]);
      console.log("AsistenciaModel.getByClaseId - Results count:", rows?.length || 0);
      return rows;
    } catch (error) {
      console.error("AsistenciaModel.getByClaseId - Error:", error);
      throw error;
    }
  }

  static async confirmById({ asistencia_id }) {
    try {
      console.log("AsistenciaModel.confirmById - ID:", asistencia_id);
      const [result] = await db.query("update asistencias set asistencia=true where asistencia_id=?", [asistencia_id]);
      console.log("AsistenciaModel.confirmById - Result:", result);
      return result;
    } catch (error) {
      console.error("AsistenciaModel.confirmById - Error:", error);
      throw error;
    }
  }

  static async cancelById({ asistencia_id }) {
    try {
      console.log("AsistenciaModel.cancelById - ID:", asistencia_id);
      const [result] = await db.query("update asistencias set asistencia=false where asistencia_id=?", [asistencia_id]);
      console.log("AsistenciaModel.cancelById - Result:", result);
      return result;
    } catch (error) {
      console.error("AsistenciaModel.cancelById - Error:", error);
      throw error;
    }
  }

  static async create({ input }) {
    try {
      console.log("AsistenciaModel.create - Input:", input);
      const [result] = await db.query("INSERT INTO asistencias set ?", [input]);
      console.log("AsistenciaModel.create - Result:", result);
      return result;
    } catch (error) {
      console.error("AsistenciaModel.create - Error:", error);
      return false;
    }
  }

  static async delete({ input }) {
    try {
      console.log("AsistenciaModel.delete - Input:", input);
      const [result] = await db.query("DELETE FROM asistencias WHERE asistencia_id=?", [input]);
      console.log("AsistenciaModel.delete - Result:", result);
      return result;
    } catch (error) {
      console.error("AsistenciaModel.delete - Error:", error);
      return error;
    }
  }
}