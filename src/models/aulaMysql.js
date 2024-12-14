import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD
const sqlAulas ="select a.aula_id,a.creador_id,a.actividad_ofrecida_id,a.duracion,a.fecha_hora,a.salario_propuesto,a.created_at,u.usuario,u.contrasena,u.email,u.nombre,u.apellidos, u.privilegio,u.pictureURL as pictureURLusuario,act.nombre,act.descripcion,act.pictureURL as pictureURLactividad,COUNT(s.asistencia_id) AS numero_de_asistencias from aulas a LEFT JOIN usuarios u on a.creador_id=u.id LEFT JOIN Actividades act on a.actividad_ofrecida_id=act.actividad_id LEFT JOIN asistencias s ON a.aula_id = s.aula_id group by a.aula_id";
const sqlAulasConAsistencias = "select a.aula_id,a.creador_id,a.actividad_ofrecida_id,a.duracion,a.fecha_hora,a.salario_propuesto,a.created_at,u.usuario,u.contrasena,u.email,u.nombre,u.apellidos, u.privilegio,u.pictureURL as pictureURLusuario,act.nombre,act.descripcion,act.pictureURL as pictureURLactividad,COUNT(s.asistencia_id) AS numero_de_asistencias from aulas a left join usuarios u on a.creador_id=u.id LEFT JOIN Actividades act on a.actividad_ofrecida_id=act.actividad_id LEFT JOIN asistencias s ON a.aula_id = s.aula_id" ;
export const readJSON = (path) => require(path)


export class AulaModel {
  static async getAll({ creador_id }) {
    let anuncios;
    if (creador_id) {
      anuncios = await db.query(sqlAulasConAsistencias+" WHERE  a.creador_id = ? GROUP BY   a.aula_id order by a.fecha_hora", [creador_id]);
    } else{
      anuncios = await db.query(sqlAulas + " order by a.fecha_hora");
    }
    return anuncios;
  }

  static async getById({ aula_id }) {
    const anuncio = await db.query(sqlAulasConAsistencias + " where a.aula_id=? ", [aula_id]);
    return anuncio;
  }

  static async create({ input }) {
    try {
      const a = await db.query("INSERT INTO anuncios set ?", [input]);
      return a;
    } catch (error) {
      console.error(error.code);
      return false;
    }

  }
  static async delete({ input }) {
    try {
      console.log(input);
      await db.query("DELETE FROM anuncios WHERE aula_id=?", [input]);
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }

  static async update({ input }) {
    try {
      await db.query("UPDATE anuncios set ? WHERE aula_id = ?", [input, input.aula_id,]);
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }
}