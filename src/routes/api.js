import { Router } from 'express';
import 'passport';

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import db from "../database.js"; //db hace referencia a la BBDD

import funciones from '../lib/funciones.js';


export const apiRouter = Router();

apiRouter.get('/api/paises', async (req, res) => {
    const query = 'SELECT * FROM nacionalidades ORDER BY nombre';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error del servidor');
            return;
        }
        res.json(results); // Enviar los datos como JSON
    });

});

