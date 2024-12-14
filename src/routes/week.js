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
weekRouter.get("/add", funciones.isAuthenticated, async (req, res) => {
  try {
    const usuarios = await db.query(" select * from usuarios");
    const actividades = await db.query(" select * from actividades");
    res.render('week/add', { usuarios, actividades, dias });
  } catch (error) {
    console.error(error);
    req.flash("error", "Hubo algun error al intentar añadir la clase " + error);
    res.redirect("/week/list");
  }
});

weekRouter.post("/addClass", funciones.isAuthenticated, WeekController.createClass);

/* weekRouter.post("/week", funciones.isAuthenticated, WeekController.createWeek);
weekRouter.post("/duplicate", funciones.isAuthenticated, WeekController.duplicateWeek);*/
weekRouter.post("/clone", funciones.isAuthenticated, WeekController.cloneWeek); 


//DELETE
weekRouter.get("/delete/:id", funciones.isAuthenticated, WeekController.delete);

//UPDATE
weekRouter.get("/editClass/:id", funciones.isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const usuarios = await db.query(" select * from usuarios");
  const actividades = await db.query(" select * from actividades");
  const item = await db.query("SELECT * FROM semana c LEFT JOIN actividades a ON c.actividad_id = a.actividad_id WHERE c.clase_id=?", [id,]);
  res.render("week/edit", { item: item[0], actividades, usuarios,dias });
});

weekRouter.post("/edit/:id", funciones.isAuthenticated, WeekController.update);
