import funciones from "../lib/funciones.js";
import db from "../database.js"; //db hace referencia a la BBDD
import { AsistenciaController } from '../controllers/asistencias.js'
import { Router } from 'express';

export const asistenciasRouter = Router();

//GESTION DEL CRUD

//READ
asistenciasRouter.get("/list", AsistenciaController.getAll);
asistenciasRouter.get("/list/:user_id", AsistenciaController.getByUserId);


//CREATE
asistenciasRouter.post("/confirm", funciones.isAuthenticated, AsistenciaController.confirmById);
asistenciasRouter.post("/cancel", funciones.isAuthenticated, AsistenciaController.cancelById);


asistenciasRouter.post("/add/:clase_id", funciones.isAuthenticated, AsistenciaController.create);
//DELETE
asistenciasRouter.post("/delete/:asistencia_id", funciones.isAuthenticated, AsistenciaController.delete);
//UPDATE
asistenciasRouter.get("/edit/:asistencia_id", funciones.isAuthenticated, AsistenciaController.getUpdate);
asistenciasRouter.post("/edit/:asistencia_id", funciones.isAuthenticated,  AsistenciaController.update);