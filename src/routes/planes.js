import funciones from "../lib/funciones.js";
import { Router } from 'express';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { PlanController } from '../controllers/st-plan.js'
export const planesRouter = Router();


//GESTION DEL CRUD

//READ
planesRouter.get("/list", PlanController.getAll);
planesRouter.get("/list/:id", PlanController.getById);

//CREATE
planesRouter.get("/add", funciones.isAuthenticated, PlanController.getCreate);

planesRouter.post("/add", funciones.isAuthenticated, PlanController.create);
//DELETE
planesRouter.get("/delete/:id", funciones.isAuthenticated, PlanController.delete);
//UPDATE
planesRouter.get("/edit/:id", funciones.isAuthenticated, PlanController.getUpdate);

planesRouter.post("/edit/:id", funciones.isAuthenticated, PlanController.update);
