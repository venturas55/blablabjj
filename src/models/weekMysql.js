import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import moment from 'moment';
import db from "../database.js"; //db hace referencia a la BBDD
export const readJSON = (path) => require(path);
const sqlClasesQuery = "SELECT s.clase_id,s.creador_id,s.actividad_id,s.instructor_id,s.duracion,s.dia,s.hora,s.created_at,ui.nombre as nombre_instructor,ui.apellidos as apellidos_instructor,ui.email as email_instructor,ui.telefono as telefono_instructor,ui.pictureURL as pictureURL_instructor,uc.nombre as nombre_creador,uc.apellidos as apellidos_creador,uc.email as email_creador,uc.telefono as telefono_creador,uc.pictureURL as pictureURL_creador,a.nombre as nombre_actividad, a.descripcion as descripcion_actividad, a.pictureURL as pictureURL_actividad FROM semana s LEFT JOIN usuarios ui ON s.instructor_id = ui.id LEFT JOIN usuarios uc ON s.creador_id=uc.id LEFT JOIN actividades a ON s.actividad_id=a.actividad_id"


export class WeekModel {
  static async getAll() {
    const clases = await db.query(sqlClasesQuery);
    return clases;
  }

  static async getById({ id }) {
    const clase = await db.query(sqlClasesQuery + " where s.clase_id=?", id);
    return clase;
  }


  static async createClass({ input }) {
    try {
      console.log(input);
      const a = await db.query("INSERT INTO semana set ?", [input]);
      return a;
    } catch (error) {
      console.error(error.code);
      return false;
    }

  }

  static async cloneWeek({ input }) {
    try {
      // Paso 1: Obtener la semana base (lunes a domingo)
      const clasesSemana = await db.query('SELECT * FROM semana  ORDER BY dia,hora ASC');
      /*      console.log("clasesSemana");
           console.log(clasesSemana); */

      if (clasesSemana.length === 0) {
        console.log('No hay clases en la semana base.');
        return;
      }

      // Paso 2: Calcular las semanas futuras
      const ahora = moment(); // Fecha actual
      const lunesSiguiente = ahora.clone().startOf('isoWeek').add(7, 'days'); // Lunes siguiente
      const fechaFin = lunesSiguiente.clone().add(3, 'months').endOf('month'); // Fin de los próximos dos meses
      const semanasFuturas = [];
      let semanaActual = lunesSiguiente.clone();
      while (semanaActual.isBefore(fechaFin)) {
        semanasFuturas.push(semanaActual.clone()); // Agregar el lunes de esta semana
        semanaActual.add(1, 'week'); // Avanzar al lunes de la siguiente semana
      }

      // Paso 3: Insertar las clases para cada semana futura
      for (const semana of semanasFuturas) {
        // Crear las fechas y horas de las clases para cada semana futura
        const inserts = clasesSemana.map((clase) => {
          const diaOffset = clase.dia-1; // Día de la semana (0=lunes, 1=martes, ..., 6=domingo)
          const fechaClase = semana.clone().add(diaOffset, 'days').set({
            hour: moment(clase.hora, 'HH:mm').hour(),
            minute: moment(clase.hora, 'HH:mm').minute(),
          });

          return {
            creador_id: clase.creador_id,
            actividad_id: clase.actividad_id,
            instructor_id: clase.instructor_id,
            duracion: clase.duracion,
            fecha_hora: fechaClase.format('YYYY-MM-DD HH:mm:ss'),
            salario_propuesto: 0.0, // Asignar un valor por defecto o basado en tu lógica
          };
        });

        // Insertar las clases clonadas en la tabla 'clases'
        var values = inserts.map((insert) => [
          insert.creador_id,
          insert.actividad_id,
          insert.instructor_id,
          insert.duracion,
          insert.fecha_hora,
        ]);
        // Ordenar values por el atributo fecha_hora
        values.sort((a, b) => {
          const fechaHoraA = new Date(a[4]); // Convertir fecha_hora a objeto Date
          const fechaHoraB = new Date(b[4]); // Convertir fecha_hora a objeto Date
          return fechaHoraA - fechaHoraB; // Comparar las fechas
        });
        db.query('INSERT INTO clases (creador_id, actividad_id, instructor_id, duracion, fecha_hora) VALUES ?', [values]);
      }
      console.log('Clases clonadas con éxito para los próximos 3 meses.');
    } catch (error) {
      console.error('Error al clonar las semanas:', error);
    }
  }



  static async delete({ input }) {
    try {
      await db.query("DELETE FROM semana WHERE clase_id=?", [input]);
    } catch (error) {
      console.error(error.code);
      return error;
    }
  }



  static async update({ input }) {
    try {
      await db.query("UPDATE semana set ? WHERE clase_id = ?", [input, input.clase_id,]);
    } catch (error) {
      console.error(error.code + " " + error.message);
      return error;
    }
  }
}