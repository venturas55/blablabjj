import funciones from "../lib/funciones.js";
import db from "../database.js"; //db hace referencia a la BBDD
import { v4 as uuidv4 } from "uuid";
import { Router } from 'express';
import multer from "multer";
import * as url from 'url';
import * as path from 'path';
import fs from 'fs-extra';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { UsuarioController } from '../controllers/usuarios.js'

export const usuariosRouter = Router();

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
usuariosRouter.get("/list", UsuarioController.getAll);
usuariosRouter.get("/list/:id", UsuarioController.getById);

//CREATE
usuariosRouter.get("/add", funciones.isAuthenticated, (req, res) => {
  res.render("usuarios/add");
});
usuariosRouter.post("/add", funciones.isAuthenticated, uploadFoto, UsuarioController.create);
//DELETE
usuariosRouter.get("/delete/:id", funciones.isAuthenticated, UsuarioController.delete);
//UPDATE
usuariosRouter.get("/edit/:id", funciones.isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const item = await db.query("SELECT * FROM usuarios WHERE id=?", [id,]);
  res.render("usuarios/edit", { item: item[0] });
});
usuariosRouter.post("/edit/:id", funciones.isAuthenticated, uploadFoto,  UsuarioController.update);
