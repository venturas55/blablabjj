import funciones from "../lib/funciones.js";
import db from "../database.js"; //db hace referencia a la BBDD
import { Router } from 'express';
import { WeekController } from '../controllers/week.js'
const dias = [{ "id": 1, "dia": "lunes" }, { "id": 2, "dia": "martes" }, { "id": 3, "dia": "miercoles" }, { "id": 4, "dia": "jueves" }, { "id": 5, "dia": "viernes" }, { "id": 6, "dia": "sabado" }, { "id": 7, "dia": "domingo" }];

export const weekRouter = Router();



//GESTION DEL CRUD

//READ
weekRouter.get("/list", WeekController.getAll);
weekRouter.get("/list/:id", WeekController.getById);
weekRouter.get("/edit",WeekController.getAll2modify);

//CREATE
weekRouter.get("/add", funciones.isAuthenticated, funciones.isMaster,WeekController.getCreate);
weekRouter.post("/addClass", funciones.isAuthenticated,funciones.isMaster, WeekController.create);

weekRouter.post("/clone", funciones.isAuthenticated,funciones.isMaster, WeekController.cloneWeek); 


//DELETE
weekRouter.get("/delete/:id", funciones.isAuthenticated,funciones.isMaster, WeekController.delete);

//UPDATE
weekRouter.get("/editClass/:id", funciones.isAuthenticated, WeekController.getUpdate);
weekRouter.post("/edit/:id", funciones.isAuthenticated, WeekController.update);
