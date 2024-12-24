import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD

const AsistenciasQuery = "select a.asistencia_id,a.asistencia,a.clase_id,a.usuario_id,c.instructor_id,c.actividad_id,c.fecha_hora,c.duracion,act.nombre as nombre_actividad,act.descripcion as descripcion_actividad,act.pictureURL as pictureURL_actividad,uu.nombre as nombre_usuario,uu.apellidos as apellidos_usuario, uu.pictureURL as pictureURL_usuario,uu.nacionalidad,uu.genero,nac.codigo_iso,nac.nombre as pais_nombre,a.cinturon,a.grado  from asistencias a LEFT JOIN clases c on a.clase_id=c.clase_id LEFT JOIN actividades act on c.actividad_id=act.actividad_id  LEFT JOIN usuarios uu on uu.id=a.usuario_id LEFT JOIN nacionalidades nac on nac.id=uu.nacionalidad";
const rankingQuery = "select a.asistencia_id,a.asistencia,a.clase_id,a.usuario_id,c.instructor_id,c.actividad_id,c.fecha_hora,c.duracion,act.nombre as nombre_actividad,act.descripcion as descripcion_actividad,act.pictureURL as pictureURL_actividad,uu.nombre as nombre_usuario,uu.apellidos as apellidos_usuario, uu.pictureURL as pictureURL_usuario,uu.nacionalidad,uu.genero,nac.codigo_iso,nac.nombre as pais_nombre,a.cinturon,a.grado, COUNT(a.asistencia_id) AS total_asistencias from asistencias a LEFT JOIN clases c on a.clase_id=c.clase_id LEFT JOIN actividades act on c.actividad_id=act.actividad_id  LEFT JOIN usuarios uu on uu.id=a.usuario_id LEFT JOIN nacionalidades nac on nac.id=uu.nacionalidad where a.asistencia=1 GROUP BY a.usuario_id order by total_asistencias desc";
//const rankingQuery = "SELECT *,  COUNT(asistencia_id) AS total_asistencias FROM asistencias GROUP BY usuario_id"
export const readJSON = (path) => require(path)


export class AsistenciaModel {
  static async getAll() {
    let asistencias = await db.query(AsistenciasQuery);
    let ranking = await db.query(rankingQuery);
    return {asistencias,ranking};
  }



  static async getById({ id }) {
    const asistencias = await db.query(AsistenciasQuery + " where a.asistencia_id=?", id);
    return asistencias;
  }

  static async getByUserId({ user_id }) {
    const asistencias = await db.query(AsistenciasQuery + " where a.usuario_id=?", user_id);
    return asistencias;
  }

  static async getByClaseId({ id }) {
    const asistencias = await db.query(AsistenciasQuery + "  where a.clase_id=?", id);
    return asistencias;
  }  

  static async confirmById({ asistencia_id }) {
    console.log(">"+asistencia_id);
    const asistencia = await db.query("update asistencias set asistencia=true where asistencia_id=?", asistencia_id);
    return asistencia;
  } 

  static async cancelById({ asistencia_id }) {
    const asistencia = await db.query("update asistencias set asistencia=false where asistencia_id=?", asistencia_id);
    console.log(asistencia.insertId);
    return asistencia;
  } 

  static async create({ input }) {
    try {
     // console.log(input);
      const a = await db.query("INSERT INTO asistencias set ?", [input]);
      return a;
    } catch (error) {
      console.error(error.code);
      return false;
    }

  }
  static async delete({ input }) {
    try {
      await db.query("DELETE FROM asistencias WHERE asistencia_id=?", [input]);
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }

  /*  static async update({ input }) {
     try {
       console.log("UPDATE asistencias" + input);
       await db.query("UPDATE asistencias set ? WHERE asistencia_id = ?", [input, input.asistencia_id,]);
     } catch (error) {
       console.error(error.code);
       return error;
     }
   } */
}