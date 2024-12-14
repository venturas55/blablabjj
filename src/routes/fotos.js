import { Router } from "express";
import fs from 'fs-extra';
import { join, extname as _extname, resolve } from 'path';
import db from "../database.js"; //db hace referencia a la BBDD
import multer, { diskStorage } from 'multer';
//const { access, constants } = require('node:fs');
import { access, constants } from 'fs';
import funciones from "../lib/funciones.js";
import { v4 as uuidv4 } from 'uuid';
import * as url from 'url';
//const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const fotosRouter = Router();

const storage = diskStorage({
    destination: (req, file, cb) => {
        const { user } = req.body;
        const dir = join(__dirname, '../public/img/profiles/');
        return cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, (uuidv4()+ _extname(file.originalname)).toLowerCase());
    }
});

const uploadFoto = multer({
    storage,
    limits: { fileSize: 5000000, },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|bmp|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(_extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }

        return cb(("Error: Archivo debe ser una imagen valida jpeg,jpg,png,bmp o gif"));
    }
}).single('imagen');


//GESTION  foto perfil
fotosRouter.post('/profile/upload/:id', funciones.isAuthenticated, uploadFoto, async (req, res) => {
    const { id } = req.params;
    //console.log(req.file);
    //console.log(req.params);
    var usuario = await db.query("select * from usuarios where id = ?", id);
    usuario = usuario[0];

    //borramos la foto anterior del perfil
    if (usuario.pictureURL != "") {
        const filePath = resolve('src/public/img/profiles/' + usuario.pictureURL);
        access(filePath, constants.F_OK, async (err) => {
            if (err) {
                req.flash("warning", "No tiene foto de perfil!");
                console.log("No tiene foto de perfil");
            } else {
                console.log('File exists. Deleting now ...');
                await fs.remove(filePath);
            }
        });
    }

    //Ponemos la nueva
    usuario.pictureURL = req.file.filename;
    await db.query("UPDATE usuarios set  ? WHERE id=?", [usuario, id]);
    funciones.insertarLog(req.user.usuario, "UPDATE fotografia perfil", "");
    req.flash("success", "Foto de perfil actualizada con exito");
    res.redirect("/profile");
});
fotosRouter.get("/profile/borrarfoto/:id/:url", funciones.isAuthenticated, async (req, res) => {
    //console.log(req.params);
    const { url } = req.params;
    const { id } = req.params;
    await db.query("UPDATE usuarios set pictureURL = NULL WHERE id=?", [id]);
    const filePath = resolve('src/public/img/profiles/' + url);
    access(filePath, constants.F_OK, async (err) => {
        if (err) {
            console.log("No tiene foto de perfil");
        } else {
            console.log('File exists. Deleting now ...');
            await fs.remove(filePath);
        }
    });
    funciones.insertarLog(req.user.usuario, "DELETE fotografia perfil", "");
    req.flash("success", "Imagen borrada correctamente");
    res.redirect('/profile');
});