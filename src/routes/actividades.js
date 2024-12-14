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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { user } = req.body;
    if (typeof user === 'undefined') { //es una foto de icono
      const dir = path.join(__dirname, '../public/img/iconos/');
      fs.exists(dir, exist => {
        if (!exist) {
          return fs.mkdir(dir, error => cb(error, dir));
        }
        return cb(null, dir);
      })
    } else {//si no, entonces es una foto de perfil y va a otra carpeta
      const dir = path.join(__dirname, '../public/img/profiles/');
      return cb(null, dir);
    }
  },
  filename: (req, file, cb) => {
    cb(null, (uuidv4() + path.extname(file.originalname)).toLowerCase());
  }
});

const uploadFoto = multer({
  storage,
  limits: { fileSize: 5000000, },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|bmp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(("Error: Archivo debe ser una imagen valida jpeg,jpg,png,bmp o gif"));
  }
}).single('imagen');


//GESTION DEL CRUD

//READ
actividadesRouter.get("/list", ActividadController.getAll);
actividadesRouter.get("/list/:id", ActividadController.getById);

//CREATE
actividadesRouter.get("/add", funciones.isAuthenticated, (req, res) => {
  res.render("actividades/add");
});
actividadesRouter.post("/add", funciones.isAuthenticated, uploadFoto, ActividadController.create);
//DELETE
actividadesRouter.get("/delete/:id", funciones.isAuthenticated, ActividadController.delete);
//UPDATE
actividadesRouter.get("/edit/:id", funciones.isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const item = await db.query("SELECT * FROM actividades WHERE actividad_id=?", [id,]);
  res.render("actividades/edit", { item: item[0] });
});
actividadesRouter.post("/edit/:id", funciones.isAuthenticated, uploadFoto,  ActividadController.update);
