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
apiRouter.get("/api/actividades/list",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const actividades = await ActividadModel.getAll();
      res.json(actividades);
    } catch (error) {
      console.error("Error fetching actividades:", error);
      res.status(500).json({ message: "Error al obtener actividades" });
    }
  });
apiRouter.get("/api/actividades/:id", async (req, res) => {
  const { id } = req.params;
  const [actividad] = await ActividadModel.getById({ id });
  res.json(actividad);
});
apiRouter.post("/api/actividades/edit", async (req, res, next) => {
  const { actividad_id, nombre, descripcion } = req.body;
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
  /*const clases = await CalendarioModel.getAll();
  //Se añade la info de los asistentes de cada clase
   for (let i = 0; i < clases.length; i++) {
    var asistentes = await AsistenciaModel.getByClaseId({
      id: clases[i].clase_id,
    });
    clases[i].asistentes = asistentes;
  } */

  let input = "";
  const [rows] = await CalendarioModel.getAll(input);
  const clases = rows.reduce((acc, row) => {
    const clase = acc.find(c => c.clase_id === row.clase_id);
    if (clase) {
      clase.asistencias.push({
        asistencia_id: row.asistencia_id,
        usuario_id: row.usuario_id,
        nombre: row.usuario_nombre,
        apellidos: row.usuario_apellidos,
        email: row.usuario_email,
        telefono: row.usuario_telefono,
        pictureURL: row.usuario_pictureURL,
        cinturon: row.cinturon,
        grado: row.grado
      });
    } else {
      acc.push({
        clase_id: row.clase_id,
        creador_id: row.creador_id,
        actividad_id: row.actividad_id,
        instructor_id: row.instructor_id,
        duracion: row.duracion,
        fecha_hora: row.fecha_hora,
        salario_propuesto: row.salario_propuesto,
        created_at: row.created_at,
        nombre_actividad: row.nombre_actividad,
        nombre_instructor: row.nombre_instructor,
        apellidos_instructor: row.apellidos_instructor,
        email_instructor: row.email_instructor,
        pictureURL_instructor: row.pictureURL_instructor,
        asistencias: row.asistencia_id ? [{
          asistencia_id: row.asistencia_id,
          usuario_id: row.usuario_id,
          nombre: row.usuario_nombre,
          apellidos: row.usuario_apellidos,
          email: row.usuario_email,
          telefono: row.usuario_telefono,
          pictureURL_usuario: row.usuario_pictureURL,
          cinturon: row.cinturon,
          grado: row.grado
        }] : []
      });
    }
    return acc;
  }, []);




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
  try {
    const { id } = req.params;
    console.log("API Route - Getting user with ID:", id);

    const usuario = await UsuarioModel.getById({ id });
    console.log("API Route - User found:", usuario ? { id: usuario.id, usuario: usuario.usuario } : null);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const asistencias = await AsistenciaModel.getByUserId({ user_id: id });
    usuario.asistencias = asistencias;

    console.log("API Route - Sending response with asistencias count:", asistencias?.length || 0);
    res.json(usuario);
  } catch (error) {
    console.error("API Route - Error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

apiRouter.get(
  "/api/usuarios/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log('Profile Route - User:', req.user);
      console.log('Profile Route - Requested ID:', req.params.id);

      const { id } = req.params;

      // Get user without destructuring
      const usuario = await UsuarioModel.getById({ id });
      console.log('Profile Route - Usuario result:', usuario);

      if (!usuario) {
        console.log('Profile Route - No user found');
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Get asistencias
      const asistencias = await AsistenciaModel.getByUserId({ user_id: id });
      console.log('Profile Route - Asistencias count:', asistencias?.length || 0);

      // Combine the data
      const responseData = {
        ...usuario,
        asistencias: asistencias || []
      };

      console.log('Profile Route - Sending response');
      res.json(responseData);
    } catch (error) {
      console.error('Profile Route - Error:', error);
      res.status(500).json({
        message: 'Error interno del servidor',
        error: error.message
      });
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
  const usuario = await UsuarioModel.getById({ id });
  if (!usuario) {
    return res.status(404).json({ message: "User not found" });
  }
  console.log("user foto ", usuario);
  const photoPath = path.join(
    __dirname,
    "..",
    "public",
    "img",
    "profiles",
    `${usuario.pictureURL}`
  );
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

//Apuntarse a clase
apiRouter.post("/api/add/:clase_id", async (req, res, next) => {
  const { clase_id } = req.params
  const item = {
    clase_id,
    usuario_id: req.body.id,
    cinturon: req.body.cinturon,
    grado: req.body.grado
  };
  try {
    const result = await AsistenciaModel.create({ input: item });
    if (result === false) {
      return res.status(404).json({ message: 'No se apunto a la clase' })
    }
    res.json(result);
  } catch (error) {
    console.error(error.code);
    res.json("error");
  }

});
