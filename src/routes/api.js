import { Router } from "express";
import passport from "passport";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import db from "../database.js"; //db hace referencia a la BBDD
import { ClaseModel } from "../models/claseMysql.js";
import { UsuarioModel } from "../models/usuarioMysql.js";
import { CalendarioModel } from "../models/calendarioMysql.js";
import { AsistenciaModel } from "../models/asistenciaMysql.js";

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

apiRouter.get("/api/clases/:id", async (req, res) => {
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

apiRouter.get(
  "/api/usuarios/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    const [usuario] = await UsuarioModel.getById({ id });
    const asistencias = await AsistenciaModel.getByUserId({ user_id: id });
    usuario.asistencias = asistencias;
    res.json(usuario); // Enviar los datos como JSON
  }
);

apiRouter.post("/api/login", (req, res, next) => {
  console.log("POST /api/login");
  console.log(req);
  passport.authenticate(
    "local.signin",
    { session: false },
    (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info.message });
      // Genera un token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        "brounaclavesecretisimaawe",
        { expiresIn: "1h" }
      );
      res.json({ token, user });
    }
  )(req, res, next);
});
