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
import { UsuarioModel } from '../models/usuarioMysql.js'
import { ExtraModel } from '../models/extraMysql.js'

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
  limits: { fileSize: 10000000, },
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

usuariosRouter.get("/list", UsuarioController.getAll); // Muestra un listado de todos los usuarios
usuariosRouter.get("/profile", funciones.isAuthenticated, (req, res) => {
  res.render('profile/list');
});// Muestra usuario logado
usuariosRouter.get("/get/:id", UsuarioController.getById);// Muestra un usuario indicando id

//CREATE
usuariosRouter.get("/add", funciones.isAuthenticated, (req, res) => {
  res.render("usuarios/add");
});
usuariosRouter.post("/add", funciones.isAuthenticated, uploadFoto, UsuarioController.create);
//DELETE
usuariosRouter.get("/delete/:id", funciones.isAuthenticated, UsuarioController.delete);

const cinturones = [
  { "value": "blanco", "nombre": "Blanco" },
  { "value": "gris-blanco", "nombre": "Blanco y Gris" },
  { "value": "gris", "nombre": "Gris" },
  { "value": "gris-negro", "nombre": "Gris y Negro" },
  { "value": "amarillo-blanco", "nombre": "Amarillo y Blanco" },
  { "value": "amarillo", "nombre": "Amarillo" },
  { "value": "amarillo-negro", "nombre": "Amarillo y Negro" },
  { "value": "naranja-blanco", "nombre": "Naranja y Blanco" },
  { "value": "naranja", "nombre": "Naranja" },
  { "value": "naranja-negro", "nombre": "Naranja y Negro" },
  { "value": "verde-blanco", "nombre": "Verde y Blanco" },
  { "value": "verde", "nombre": "Verde" },
  { "value": "verde-negro", "nombre": "Verde y Negro" },
  { "value": "azul", "nombre": "Azul" },
  { "value": "morado", "nombre": "Morado" },
  { "value": "marron", "nombre": "Marrón" },
  { "value": "negro", "nombre": "Negro" }
]

const grados = [
  { "value": "", "nombre": "Sin grados" },
  { "value": "I", "nombre": "I" },
  { "value": "II", "nombre": "I I" },
  { "value": "III", "nombre": "I I I" },
  { "value": "IIII", "nombre": "I I I I" }
]

//UPDATE
usuariosRouter.get("/edit", funciones.isAuthenticated, async (req, res) => {
  const { id } = req.user;
  const item = await UsuarioModel.getById( { id });
  const paises = await ExtraModel.getAllPaises();

  res.render("profile/edit", { item: item[0],paises,grados,cinturones });
});
usuariosRouter.get("/edit/:id", funciones.isAuthenticated, funciones.isMaster,async (req, res) => {
  const { id } = req.params;
  const item = await UsuarioModel.getById({ id });
  const paises = await ExtraModel.getAllPaises();
  res.render("profile/edit", { item: item[0],paises,grados,cinturones });
});

usuariosRouter.post("/edit/:id", funciones.isAuthenticated, UsuarioController.update);
