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
  const dias = [{ "id": 1, "dia": "lunes" }, { "id": 2, "dia": "martes" }, { "id": 3, "dia": "miercoles" }, { "id": 4, "dia": "jueves" }, { "id": 5, "dia": "viernes" }, { "id": 6, "dia": "sabado" }, { "id": 7, "dia": "domingo" }];
  try {
    const usuarios = await db.query(" select * from usuarios");
    const actividades = await db.query(" select * from actividades");
    res.render('clases/addClassWeek', { usuarios, actividades, dias });
  } catch (error) {
    console.error(error);
    req.flash("error", "Hubo algun error al intentar añadir la clase " + error);
    res.redirect("/clases/list");
  }
});
/* clasesRouter.post("/addClassWeek", funciones.isAuthenticated, ClaseController.addClassWeek); */

/* clasesRouter.post("/week", funciones.isAuthenticated, ClaseController.createWeek);
clasesRouter.post("/duplicate", funciones.isAuthenticated, ClaseController.duplicateWeek);
clasesRouter.post("/clone", funciones.isAuthenticated, ClaseController.cloneWeek); */
//DELETE
clasesRouter.get("/delete/:id", funciones.isAuthenticated, ClaseController.delete);
//UPDATE
clasesRouter.get("/edit/:id", funciones.isAuthenticated, ClaseController.getUpdate);
clasesRouter.post("/edit/:id", funciones.isAuthenticated, ClaseController.update);
