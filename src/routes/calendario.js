import funciones from "../lib/funciones.js";
import db from "../database.js"; //db hace referencia a la BBDD
import { Router } from 'express';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { CalendarioController } from '../controllers/calendario.js'


export const calendarioRouter = Router();

//GESTION DEL CRUD

//READ
calendarioRouter.get("/list", CalendarioController.getAll);
calendarioRouter.get("/list/:id", CalendarioController.getById);

//CREATE
calendarioRouter.post("/add/:anuncio_id", funciones.isAuthenticated, CalendarioController.create);

//DELETE
calendarioRouter.post("/delete/:id", funciones.isAuthenticated, CalendarioController.delete);

