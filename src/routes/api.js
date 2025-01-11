import { Router } from "express";
//import passport from "passport";
import passport from "../lib/passport.js"; //para que se entere de la autentificacion que se ha creado
import { Strategy as LocalStrategy } from "passport-local";
import funciones from "../lib/funciones.js";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import db from "../database.js"; //db hace referencia a la BBDD
import { ClaseModel } from "../models/claseMysql.js";
import { UsuarioModel } from "../models/usuarioMysql.js";
import { CalendarioModel } from "../models/calendarioMysql.js";
import { AsistenciaModel } from "../models/asistenciaMysql.js";
import { MembresiaModel } from "../models/membresiaMysql.js";
import { ActividadModel } from "../models/actividadMysql.js";
import * as path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import jwt from "jsonwebtoken";

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

apiRouter.get("/api/clases/list", async (req, res) => {
  const clases = await ClaseModel.getAll();
  res.json(clases); 
});
apiRouter.get("/api/actividades/list", async (req, res) => {
  const actividades = await ActividadModel.getAll();
  res.json(actividades); 
});
apiRouter.get("/api/actividades/:id", async (req, res) => {
  const { id } = req.params;
  const [actividad] = await ActividadModel.getById({ id });
  res.json(actividad); 
});
apiRouter.post("/api/actividades/edit", async (req, res, next) => {
  const { actividad_id,nombre,descripcion } = req.body;
  const newItem = {
    actividad_id,
    nombre,
    descripcion,
};
  try {
      const result = await ActividadModel.update({ input: newItem })
      if (result === false) {
          return res.status(404).json({ message: 'Actividad not found' })
      }
      res.json(result); 
  } catch (error) {
      console.error(error.code);
      res.json("error"); 
  }

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
  res.json(clases); 
});

apiRouter.get("/api/asistencias", async (req, res) => {
  const asistencias = await AsistenciaModel.getAll();
  res.json(asistencias); 
});

apiRouter.get("/api/membresias", async (req, res) => {
  const membresias = await MembresiaModel.getAll();
  res.json(membresias); 
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

apiRouter.get("/api/usuario/:id", async (req, res) => {
  const { id } = req.params;
  const [usuario] = await UsuarioModel.getById({ id });
  console.log("user ", usuario);
  const asistencias = await AsistenciaModel.getByUserId({ user_id: id });
  usuario.asistencias = asistencias;
  res.json(usuario); // Enviar los datos como JSON
});

apiRouter.get(
  "/api/usuarios/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log('Protected Route - User:', req.user);
      console.log('Requested User ID:', req.params.id);
      
      const { id } = req.params;
      const [usuario] = await UsuarioModel.getById({ id });
      const asistencias = await AsistenciaModel.getByUserId({ user_id: id });
      
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      usuario.asistencias = asistencias;
      res.json(usuario);
    } catch (error) {
      console.error('Error in protected route:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

apiRouter.get(
  "/api/auth-test",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ 
      message: "Autenticación exitosa",
      user: req.user
    });
  }
);

apiRouter.get("/api/usuario/foto/:id", async (req, res) => {
  const { id } = req.params;
  const [usuario] = await UsuarioModel.getById({ id });
  console.log("user foto ", usuario);
  const photoPath = path.join(
    __dirname,
    "..",
    "public",
    "img",
    "profiles",
    `${usuario.pictureURL}`
  );
  console.log(photoPath);
  res.sendFile(photoPath);
});

apiRouter.post(
  "/api/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/",
    failureRedirect: "/signup",
    passReqToCallback: true,
    failureFlash: true,
  })
);

/* apiRouter.post("/api/login", passport.authenticate("local.signin", (req, res) => {
  res.json({
    success: true,
    message: 'Usuario autenticado',
    user: req.user // El usuario autenticado será enviado aquí
  });
}));
 */
apiRouter.post("/api/login", (req, res, next) => {
  passport.authenticate("local.signin", (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error en el servidor",
        error: err,
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      });
    }

    // Establecer req.user usando req.login
    req.login(user, { session: false }, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({
          success: false,
          message: "Error al iniciar sesión",
        });
      }

      // Generar un token JWT
      const token = jwt.sign({ id: user.id }, "brounaclavesecretisimaawe", {
        expiresIn: "1h",
      });

      return res.json({
        success: true,
        message: "Usuario autenticado",
        user: {
          id: user.id,
          usuario: user.usuario,
          email: user.email,
          cinturon: user.cinturon,
          grado: user.grado,
        }, // Datos esenciales del usuario
        token, // El token JWT
      });
    });
  })(req, res, next); // Invoca el middleware con los parámetros correctos
});

apiRouter.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true, message: "Sesión cerrada con éxito" });
  });
});

// Ruta protegida
apiRouter.get(
  "/api/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: `Hola ${req.user.email}, tienes acceso.` });
  }
);
