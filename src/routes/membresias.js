import funciones from "../lib/funciones.js";
import { Router } from 'express';
import express from 'express';

import { MembresiaController } from '../controllers/membresias.js'

export const membresiasRouter = Router();



// Crear una sesión de pago para una tarifa específica
membresiasRouter.get('/landing', funciones.isAuthenticated, MembresiaController.getLanding);

membresiasRouter.get('/list', funciones.isAuthenticated, MembresiaController.getList);

membresiasRouter.post('/create-checkout-session', funciones.isAuthenticated, MembresiaController.getCheckOutSession);

membresiasRouter.get('/success', funciones.isAuthenticated, MembresiaController.getSuccess);

membresiasRouter.post('/cancel/:id', funciones.isAuthenticated,funciones.isMaster, MembresiaController.postCancel);
membresiasRouter.post('/resume/:id', funciones.isAuthenticated,funciones.isMaster,MembresiaController.postResume);

membresiasRouter.post('/create-portal-session', funciones.isAuthenticated, MembresiaController.createPortal);

membresiasRouter.post('/webhook', funciones.isAuthenticated, express.raw({ type: 'application/json' }), MembresiaController.webhook);

membresiasRouter.get('/pruebas', funciones.isAuthenticated, MembresiaController.pruebas);