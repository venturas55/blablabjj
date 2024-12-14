import funciones from "../lib/funciones.js";
import db from "../database.js"; //db hace referencia a la BBDD
import { AsistenciaController } from '../controllers/asistencias.js'
import { Router } from 'express';

export const asistenciasRouter = Router();

//GESTION DEL CRUD

//READ
asistenciasRouter.get("/list", AsistenciaController.getAll);
asistenciasRouter.get("/list/:asistencia_id", AsistenciaController.getById);
asistenciasRouter.get("/:asistencia_id", AsistenciaController.getById);
//CREATE
/* asistenciasRouter.get("/add", funciones.isAuthenticated,async  (req, res) => {
  const actividades = await db.query("SELECT * FROM actividades");
  res.render("anuncios/add",{actividades});
}); */
asistenciasRouter.post("/add/:clase_id", funciones.isAuthenticated, AsistenciaController.create);


//DELETE
asistenciasRouter.get("/delete/:asistencia_id", funciones.isAuthenticated, AsistenciaController.delete);
//UPDATE
asistenciasRouter.get("/edit/:asistencia_id", funciones.isAuthenticated, async (req, res) => {
  const { asistencia_id } = req.params;
  const [item] = await db.query("SELECT * FROM asistencias WHERE asistencia_id=?", [asistencia_id,]);
  res.render("asistencias/list", { item });
});
asistenciasRouter.post("/edit/:asistencia_id", funciones.isAuthenticated,  AsistenciaController.update);