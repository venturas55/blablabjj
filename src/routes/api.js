import { Router } from "express";
import passport from "passport";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import db from "../database.js"; //db hace referencia a la BBDD
import { ClaseModel } from "../models/claseMysql.js";
import { UsuarioModel } from "../models/usuarioMysql.js";
import { CalendarioModel } from "../models/calendarioMysql.js";
import { AsistenciaModel } from "../models/asistenciaMysql.js";
import * as path from 'path';  
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

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

apiRouter.post("/api/login", (req, res, next) => {
  console.log("Que va POST /api/login");
  console.log("usuario" + JSON.stringify(req));
  passport.authenticate(
    "local.signin",
    { session: false },
    (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info.message });
      // Genera un token JWT
      const token = jwt.sign(
        { usuario: user.usuario, contrasena: user.contrasena },
        "brounaclavesecretisimaawe",
        { expiresIn: "1h" }
      );
      res.json({ token, user: { id: user.id, email: user.email, usuario: user.usuario } });
    }
  )(req, res, next);
});

// Ruta protegida
apiRouter.get(
  '/api/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ message: `Hola ${req.user.email}, tienes acceso.` });
  }
);