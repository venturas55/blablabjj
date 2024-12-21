import funciones from "../lib/funciones.js";
import db from "../database.js"; //db hace referencia a la BBDD
import { Router } from 'express';
import { ClaseController } from '../controllers/clases.js'

export const clasesRouter = Router();



//GESTION DEL CRUD

//READ
clasesRouter.get("/list", ClaseController.getAll);
clasesRouter.get("/list/:id", ClaseController.getById);
clasesRouter.get("/week", ClaseController.getWeek);
clasesRouter.get("/ver/:id", ClaseController.getClase);

//CREATE
clasesRouter.get("/add", funciones.isAuthenticated, ClaseController.getCreate);
clasesRouter.post("/add", funciones.isAuthenticated, ClaseController.create);

clasesRouter.get("/addClassWeek", funciones.isAuthenticated,funciones.isMaster, async (req, res) => {

});
clasesRouter.get("/addClassWeek", funciones.isAuthenticated, ClaseController.getAddClassWeek);
/* clasesRouter.post("/addClassWeek", funciones.isAuthenticated, ClaseController.addClassWeek); */

//DELETE
clasesRouter.get("/delete/:id", funciones.isAuthenticated, ClaseController.delete);
clasesRouter.post("/deleteAll", funciones.isAuthenticated, ClaseController.deleteAllFutureClass);


//UPDATE
clasesRouter.get("/edit/:id", funciones.isAuthenticated, ClaseController.getUpdate);
clasesRouter.post("/edit/:id", funciones.isAuthenticated, ClaseController.update);
