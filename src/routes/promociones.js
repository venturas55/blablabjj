import funciones from "../lib/funciones.js";
import db from "../database.js"; //db hace referencia a la BBDD
import { PromocionController } from '../controllers/promociones.js'
import { Router } from 'express';

export const promocionesRouter = Router();

//GESTION DEL CRUD

//READ
promocionesRouter.get("/list", PromocionController.getAll);
promocionesRouter.get("/list/:user_id", funciones.isAuthenticated, PromocionController.getByUserId);

//CREATE
promocionesRouter.post("/confirm", funciones.isAuthenticated, PromocionController.confirmById);
promocionesRouter.post("/cancel", funciones.isAuthenticated, PromocionController.cancelById);

                //solicitar asistencia por usuario
promocionesRouter.post("/add", funciones.isAuthenticated, PromocionController.create);
//DELETE
promocionesRouter.post("/delete/:promocion_id", funciones.isAuthenticated, PromocionController.delete);
//UPDATE
promocionesRouter.get("/edit/:promocion_id", funciones.isAuthenticated, PromocionController.getUpdate);
promocionesRouter.post("/edit/:promocion_id", funciones.isAuthenticated,  PromocionController.update);