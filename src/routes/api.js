import { Router } from "express";
import "passport";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import db from "../database.js"; //db hace referencia a la BBDD
import { ClaseModel } from "../models/claseMysql.js";
import { UsuarioModel } from "../models/usuarioMysql.js";
import { CalendarioModel } from "../models/calendarioMysql.js";
import { AsistenciaModel } from "../models/asistenciaMysql.js";
import funciones from "../lib/funciones.js";

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
  const clases = await CalendarioModel.getAll(input);
  //Se añade la info de los asistentes de cada clase
  for (let i = 0; i < clases.length; i++) {
    clases[i].asistentes = [];
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
  const asistentes = await AsistenciaModel.getByClaseId({ id: id });
  const clase = await ClaseModel.getById({ id: id });
  var yomismo;
  asistentes.forEach((asistente) => {
    if (asistente.usuario_id == req.user.id) {
      asistente.asiste = true;
      yomismo = asistente;
    }
  });
  clase.asistentes = asistentes;
  res.json(clase); // Enviar los datos como JSON
});

apiRouter.get("/api/usuarios", async (req, res) => {
  const usuarios = await UsuarioModel.getAll();
  res.json(usuarios); // Enviar los datos como JSON
});

apiRouter.get("/api/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const [usuario] = await UsuarioModel.getById({ id });
  const asistencias = await AsistenciaModel.getByUserId({ user_id: id });
  usuario.asistencias = asistencias;
  res.json(usuario); // Enviar los datos como JSON
});

apiRouter.get("/api/clases", async (req, res) => {
  const clases = await ClaseModel.getAll();
  res.json(clases); // Enviar los datos como JSON
});

apiRouter.get("/api/clases", async (req, res) => {
  const clases = await ClaseModel.getAll();
  res.json(clases); // Enviar los datos como JSON
});
