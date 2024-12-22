import funciones from "../lib/funciones.js";
import db from "../database.js"; //db hace referencia a la BBDD
import { Router } from 'express';
import { WeekController } from '../controllers/week.js'

export const weekRouter = Router();



//GESTION DEL CRUD

//READ
weekRouter.get("/list", WeekController.getAll);
weekRouter.get("/list/:id", WeekController.getById);

//CREATE
//weekRouter.get("/add", funciones.isAuthenticated, funciones.isMaster,WeekController.getCreate);
weekRouter.post("/add", funciones.isAuthenticated,funciones.isMaster, WeekController.create);

weekRouter.post("/clone", funciones.isAuthenticated,funciones.isMaster, WeekController.cloneWeek); 


//DELETE
weekRouter.get("/delete/:id", funciones.isAuthenticated,funciones.isMaster, WeekController.delete);

//UPDATE
weekRouter.get("/edit/:id", funciones.isAuthenticated, WeekController.getUpdate);
weekRouter.post("/edit/:id", funciones.isAuthenticated, WeekController.update);
