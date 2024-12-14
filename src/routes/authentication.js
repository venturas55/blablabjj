import { Router } from 'express';
import passport from "passport";
//import { authenticate } from 'passport';
import funciones from '../lib/funciones.js';
import le from '../lib/passport.js'; //se usa para importar los localstrategies

export const authRouter = Router();

authRouter.get('/signup',funciones.isNotAuthenticated,(req,res)=>{
    res.render('auth/signup')
});

authRouter.post('/signup', passport.authenticate('local.signup',{
        successRedirect: '/profile',
        failureRedirect: '/signup',
        passReqToCallback: true,
        failureFlash: true
    })
);

authRouter.get('/signin',funciones.isNotAuthenticated,(req,res)=>{
    res.render('auth/signin');
});

authRouter.post('/signin',(req,res,next)=>{
    console.log("voy auth");
    passport.authenticate('local.signin',{
       successRedirect: '/profile',
       failureRedirect: '/signin',
       failureFlash:true

   })(req,res,next);
});

authRouter.get('/logout',funciones.isAuthenticated ,(req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})

//GESTION DEL profile

authRouter.get('/profile',funciones.isAuthenticated ,(req,res)=>{
    res.render('profile');
});

authRouter.get('/profile/edit',funciones.isAuthenticated ,(req,res)=>{
    res.render('profileEdit');
});
authRouter.post('/profile/edit/',funciones.isAuthenticated ,async (req,res)=>{
     const newUser = {
        usuario:    req.body.usuario,
        contrasena: req.body.contrasena,
        email:      req.body.email,
        full_name:  req.body.fullname,
        privilegio: "san",
    }; 
    //newUser.contrasena = await funciones.encryptPass(password);
    console.log("guardando en la BBDD");
    //console.log(user);
    res.render('profile');
});

//TODO: Añadir posibilidad de cambio de contraseña del usuario
