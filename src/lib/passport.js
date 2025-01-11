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
      usernameField: "email",
      passwordField: "contrasena",
      passReqToCallback: true,
    },
    async (req, email, contrasena, done) => {
      try {
        console.log("Local Strategy - Login attempt for email:", email);
        
        const [users] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
          email,
        ]);
        
        if (!users || users.length === 0) {
          console.log("Local Strategy - No user found with email:", email);
          return done(null, false, { message: "Usuario no encontrado" });
        }
        
        const user = users[0];
        console.log("Local Strategy - Found user:", { id: user.id, email: user.email });
        
        const validPassword = await funciones.matchPassword(
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
        console.log(yaExiste[0].usuario);
        console.log("Ya existe");
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
        console.log(result);
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
    async (jwtPayload, done) => {
      try {
        console.log('JWT Strategy - Payload:', jwtPayload);
        
        if (!jwtPayload || typeof jwtPayload.id !== 'number') {
          console.log('JWT Strategy - Invalid payload or ID:', jwtPayload);
          return done(null, false);
        }
        
        const user = await UsuarioModel.getById({ id: jwtPayload.id });
        console.log('JWT Strategy - Query result:', user);
        
        if (!user) {
          console.log('JWT Strategy - No user found with ID:', jwtPayload.id);
          return done(null, false);
        }
        
        console.log('JWT Strategy - User found:', {
          id: user.id,
          usuario: user.usuario,
          email: user.email,
          privilegio: user.privilegio
        });
        return done(null, user);
      } catch (error) {
        console.error('JWT Strategy Error:', error);
        return done(error, false);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user.id);
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user:", id);
    const user = await UsuarioModel.getById({ id });
    done(null, user);
  } catch (error) {
    console.error("Deserialize Error:", error);
    done(error, null);
  }
});

export default passport;
