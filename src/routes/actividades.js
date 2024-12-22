import funciones from "../lib/funciones.js";
import db from "../database.js"; //db hace referencia a la BBDD
import { v4 as uuidv4 } from "uuid";
import { Router } from 'express';
import multer from "multer";
import * as url from 'url';
import * as path from 'path';
import fs from 'fs-extra';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { ActividadController } from '../controllers/actividades.js'

export const actividadesRouter = Router();


//GESTION DEL CRUD

//READ
actividadesRouter.get("/list", ActividadController.getAll);
actividadesRouter.get("/list/:id", ActividadController.getById);

//CREATE
actividadesRouter.get("/add", funciones.isAuthenticated, ActividadController.getCreate);
actividadesRouter.post("/add", funciones.isAuthenticated, ActividadController.create);
//DELETE
actividadesRouter.get("/delete/:id", funciones.isAuthenticated, ActividadController.delete);
//UPDATE
actividadesRouter.get("/edit/:id", funciones.isAuthenticated, ActividadController.getUpdate);
actividadesRouter.post("/edit/:id", funciones.isAuthenticated,   ActividadController.update);