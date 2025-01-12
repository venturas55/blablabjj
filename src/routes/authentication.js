import { Router } from "express";
import passport from "passport";
import passportauth from "../lib/passportauth.js";
import funciones from "../lib/funciones.js";

export const authRouter = Router();

authRouter.get("/signup", funciones.isNotAuthenticated, (req, res) => {
  res.render("auth/signup");
});

authRouter.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/",
    failureRedirect: "/signup",
    passReqToCallback: true,
    failureFlash: true,
  })
);

authRouter.get("/signin", funciones.isNotAuthenticated, (req, res) => {
  res.render("auth/signin");
});

authRouter.post("/signin", (req, res, next) => {
  passport.authenticate("local.signin", {
    successRedirect: "/",
    failureRedirect: "/signin",
    failureFlash: true,
  })(req, res, next);
});

authRouter.get("/logout", funciones.isAuthenticated, (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

authRouter.get(
  "/auth/google",
  passportauth.authenticate("google", { scope: ["profile"] })
);

authRouter.get(
  "/auth/google/callback",
  passportauth.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    // Successful authentication, redirect home.
    req.flash("success", "Logueo por google realizada correctamente");
    res.redirect("/");
  }
);
