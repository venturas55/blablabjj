import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import db from "../database.js";
import funciones from "../lib/funciones.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UsuarioModel } from '../models/usuarioMysql.js'; 

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "usuario",
      passwordField: "contrasena",
      passReqToCallback: true,
    },
    async (req, usuario, contrasena, done) => {
      try {
        //console.log("Local Strategy - Login attempt for usuario:", usuario);
        
        // Get user from database
        const [rows] = await db.query(
          "SELECT * FROM usuarios WHERE usuario = ?",
          [usuario]
        );
        
        // With mysql2/promise, rows is the array of results
        const user = rows && rows.length > 0 ? rows[0] : null;
        
      /*   console.log("Local Strategy - Database result:", {
          found: !!user,
          user: user ? {
            id: user.id,
            usuario: user.usuario,
            hashedPassword: user.contrasena ? '[exists]' : '[missing]'
          } : null
        }); */

        if (!user) {
          console.log("Local Strategy - No user found with usuario:", usuario);
          return done(null, false, { message: "Usuario no encontrado" });
        }

        if (!user.contrasena) {
          console.log("Local Strategy - User has no password");
          return done(null, false, { message: "Error en las credenciales" });
        }
        
        console.log("Local Strategy - Verifying password for user:", user.id);
        const validPassword = await funciones.verifyPassword(
          contrasena,
          user.contrasena
        );
        
        if (!validPassword) {
          console.log("Local Strategy - Invalid password for user:", user.id);
          return done(null, false, { message: "Contraseña incorrecta" });
        }
        
        console.log("Local Strategy - Login successful for user:", user.id);
        done(null, user);
      } catch (error) {
        console.error("Local Strategy - Error:", error);
        done(error);
      }
    }
  )
);

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "usuario",
      passwordField: "contrasena",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      //const { cuerpo } = req.body;
      const newUser = {
        usuario: username,
        contrasena: password,
        email: req.body.email,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        privilegio: "none",
      };
      newUser.contrasena = await funciones.encryptPass(password);
      const yaExiste = await db.query(
        "SELECT * FROM usuarios WHERE usuario=?",
        newUser.usuario
      );
      if (yaExiste[0]) {
        return done(
          null,
          false,
          req.flash(
            "danger",
            "El usuario ya existe! Puebe con otro nombre de usuario."
          )
        );
      } else {
        console.log("No existe");
        const result = await db.query("INSERT INTO usuarios SET ?", [newUser]);
        newUser.id = result.insertId;
        return done(null, newUser);
      }
    }
  )
);

// Configuración de la estrategia JWT
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "brounaclavesecretisimaawe",
    },
    async (payload, done) => {
      try {
        //console.log("JWT Strategy - Payload:", payload);
        //console.log("JWT Strategy - Headers:", JSON.stringify(ExtractJwt.fromAuthHeaderAsBearerToken(), null, 2));
        
        if (!payload || typeof payload.id !== 'number') {
          console.log("JWT Strategy - Invalid payload:", payload);
          return done(null, false, { message: "Token inválido" });
        }
        
        const user = await UsuarioModel.getById({ id: payload.id });
        
        // Safe access to user properties
        const userInfo = user ? {
          found: true,
          id: user.id,
          usuario: user.usuario
        } : {
          found: false,
          id: payload.id,
          usuario: null
        };
        
        //console.log("JWT Strategy - User lookup result:", userInfo);

        if (!user) {
          console.log("JWT Strategy - No user found with ID:", payload.id);
          return done(null, false, { message: "Usuario no encontrado" });
        }

        console.log("JWT Strategy - User authenticated:", user.id);
        done(null, user);
      } catch (error) {
        console.error("JWT Strategy - Error:", error);
        done(error, false);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  //console.log("Serializing user:", user.id);
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    //console.log("Deserializing user:", id);
    const user = await UsuarioModel.getById({ id });
    done(null, user);
  } catch (error) {
    console.error("Deserialize Error:", error);
    done(error, null);
  }
});

export default passport;
