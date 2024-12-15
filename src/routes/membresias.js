import funciones from "../lib/funciones.js";
import db from "../database.js"; //db hace referencia a la BBDD
import { Router } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_PRIV || 'PRIVATE KEY');

export const membresiasRouter = Router();


// Crear una sesión de pago para una tarifa específica
membresiasRouter.get('/landing', async (req, res) => {
    res.render("membresia/landing");
});


membresiasRouter.post('/create-checkout-session', async (req, res) => {

    const plan = req.body.plan;

    if (!plan) {
        return res.send("Suscription plan not found");
    } else {
        console.log(plan);
    }
    let priceId;
    switch (plan.toLowerCase()) {
        case 'bjjfemenino':
            //priceId = 'price_1QW5bcHIbGnmSt50aeWYdSgQ'; 
            priceId = 'price_1QW5uBKIeHEOMKlDTuF8QGpf';
            break;
        case 'bjjadultos':
            //priceId = 'price_1QW5cJHIbGnmSt50CgOo9QkQ'; 
            priceId = 'price_1QW5wcKIeHEOMKlDZ5HUPw8j';
            break;
        default:
            return res.send("Suscription plan not found");
    }
    console.log(priceId);
    const session = await stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        line_items: [
            {
                price: priceId,
                // For metered billing, do not pass quantity
                quantity: 1,

            },
        ],
        mode: 'subscription',

        //TODO: estos links tendrían que ser más dinamicos
        success_url: `http://localhost:7001/membresia/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:7001/membresia/cancel`,
    });
  
    res.redirect(session.url);
});

membresiasRouter.get('/success', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    console.log(session);
    res.render("membresia/success");
});

membresiasRouter.get('/cancel', async (req, res) => {
    res.render("membresia/cancel");
});

membresiasRouter.get('/clientes/:cliente_id', funciones.isAuthenticated, async (req, res) => {
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: req.params.cliente_id,
        return_url: 'http://localhost:7001/usuarios/get/' + req.params.cliente_id,
    });
    console.log(portalSession);
    res.redirect(portalSession.url);
});


