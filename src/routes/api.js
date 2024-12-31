import { Router } from "express";
import passport from "passport";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import db from "../database.js"; //db hace referencia a la BBDD
import { ClaseModel } from "../models/claseMysql.js";
import { UsuarioModel } from "../models/usuarioMysql.js";
import { CalendarioModel } from "../models/calendarioMysql.js";
import { AsistenciaModel } from "../models/asistenciaMysql.js";
import { MembresiaModel } from "../models/membresiaMysql.js";
import * as path from 'path';  
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import jwt from 'jsonwebtoken';

export const apiRouter = Router();

apiRouter.get("/api/paises", async (req, res) => {
  const query = "SELECT * FROM nacionalidades ORDER BY nombre";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      res.status(500).send("Error del servidor");
      return;
    }
    res.json(results); // Enviar los datos como JSON
  });
});

apiRouter.get("/api/clases", async (req, res) => {
  const clases = await CalendarioModel.getAll();
  //Se añade la info de los asistentes de cada clase
  for (let i = 0; i < clases.length; i++) {
    var asistentes = await AsistenciaModel.getByClaseId({
      id: clases[i].clase_id,
    });
    clases[i].asistentes = asistentes;
  }
  res.json(clases); // Enviar los datos como JSON
});

apiRouter.get("/api/asistencias", async (req, res) => {
  const asistencias = await AsistenciaModel.getAll();
    res.json(asistencias); // Enviar los datos como JSON
});

apiRouter.get("/api/membresias", async (req, res) => {
  const membresias = await MembresiaModel.getAll();
    res.json(membresias); // Enviar los datos como JSON
});

apiRouter.get("/api/clase/:id", async (req, res) => {
  const { id } = req.params;
  /* const usuarios = await UsuarioModel.getAll();
    const actividades = await ActividadModel.getAll(); */
  const [clase] = await ClaseModel.getById({ id: id });
  const asistentes = await AsistenciaModel.getByClaseId({ id: id });
  clase.asistentes = asistentes;
  res.json(clase); // Enviar los datos como JSON
});

apiRouter.get("/api/usuarios", async (req, res) => {
  const usuarios = await UsuarioModel.getAll();
  res.json(usuarios); // Enviar los datos como JSON
});

apiRouter.get("/api/usuario/:id",async (req, res) => {
  const { id } = req.params;
  const [usuario] = await UsuarioModel.getById({ id });
  const asistencias = await AsistenciaModel.getByUserId({ user_id: id });
  usuario.asistencias = asistencias;
  res.json(usuario); // Enviar los datos como JSON
});

apiRouter.get("/api/usuarios/:id", passport.authenticate('jwt', { session: false }),async (req, res) => {
  const { id } = req.params;
  const [usuario] = await UsuarioModel.getById({ id });
  const asistencias = await AsistenciaModel.getByUserId({ user_id: id });
  usuario.asistencias = asistencias;
  res.json(usuario); // Enviar los datos como JSON
});

apiRouter.get("/api/usuario/foto/:id", async (req, res) => {
  const { id } = req.params;
  const [usuario] = await UsuarioModel.getById({ id });
  console.log(usuario);
  const photoPath = path.join(__dirname, '..','public','img', 'profiles', `${usuario.pictureURL}`);
  console.log(photoPath);
  res.sendFile(photoPath);
});

apiRouter.post('/api/signup', passport.authenticate('local.signup',{
        successRedirect: '/',
        failureRedirect: '/signup',
        passReqToCallback: true,
        failureFlash: true
    })
);

apiRouter.post("/api/login", passport.authenticate('local.signin', (req, res) => {
  res.json({
    success: true,
    message: 'Usuario autenticado',
    user: req.user // El usuario autenticado será enviado aquí
  });
}));

apiRouter.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true, message: 'Sesión cerrada con éxito' });
  });
});

// Ruta protegida
apiRouter.get(
  '/api/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ message: `Hola ${req.user.email}, tienes acceso.` });
  }
);