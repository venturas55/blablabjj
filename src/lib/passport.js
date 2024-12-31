import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import db from "../database.js";
import funciones from "../lib/funciones.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      //name del formulario
      usernameField: "usuario",
      passwordField: "contrasena",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const rows = await db.query("SELECT * FROM usuarios WHERE usuario= ?", [
        username,
      ]);

      if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await funciones.verifyPassword(
          password,
          user.contrasena
        );
        if (validPassword)
          done(null, user, req.flash("success", "Welcome " + user.usuario));
        else
          done(
            null,
            false,
            req.flash("danger", "El password introducido es incorrecto")
          );
      } else {
        return done(null, false, req.flash("danger", "Ese usuario no existe"));
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
      secretOrKey: "brounaclavesecretisimaawe", // Usa una clave secreta segura
    },
    async (jwtPayload, done) => {
      try {
        const [users] = await db.query("SELECT * FROM usuarios WHERE id = ?", [
          jwtPayload.id,
        ]);
        const user = users[0];

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

//comprobar esto
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [user] = await db.query("SELECT * FROM usuarios WHERE id= ?", [id]);
  done(null, user);
});

export default passport;
