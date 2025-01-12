import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import db from "../database.js";
import { UsuarioModel } from "../models/usuarioMysql.js";
import funciones from "../lib/funciones.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { config } from '../config.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
 
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL,
    scope:['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile'],
  },
  function(accessToken, refreshToken, profile, cb) {
    //CHECK IF USER EXISTS
    console.log("Id del profile: " , profile.id);
    const results = UsuarioModel.getByGoogleId(profile.id);
    console.log(results);
    if(results.length>0)
      return results[0];
   else{
    //user not present
    console.log(profile);
    const newUser = {
      google_id:profile.id,
      nombre: profile.name.givenName,
      apellidos: profile.name.familyName,
      usuario:JSON.stringify(profile.name),
      //email: profile.emails?.[0].value,
      email: profile.name.givenName+profile.name.familyName+"@gmail.com",
      pictureURL: profile.photos[0].value
    }
    console.log(newUser);
    UsuarioModel.create(newUser);
   }
    
  }
));

export default passport;
