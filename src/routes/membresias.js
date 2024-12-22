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

membresiasRouter.get('/cancel', funciones.isAuthenticated,MembresiaController.getCancel);

membresiasRouter.post('/create-portal-session', funciones.isAuthenticated, MembresiaController.createPortal);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
membresiasRouter.post('/webhook', funciones.isAuthenticated, express.raw({ type: 'application/json' }), MembresiaController.webhook);


