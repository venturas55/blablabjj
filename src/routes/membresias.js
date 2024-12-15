import funciones from "../lib/funciones.js";
import { Router } from 'express';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { ExtraModel } from '../models/extraMysql.js';

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
        //console.log(plan);
    }
    let priceId;
    switch (plan.toLowerCase()) {
        case 'bjjfemenino':
            priceId = 'price_1QW5uBKIeHEOMKlDTuF8QGpf';
            break;
        case 'kids35':
            priceId = 'price_1QWIPAKIeHEOMKlDj3sm7vqf';
            break;
        case 'kids69':
            priceId = 'price_1QWIPVKIeHEOMKlDPB5JGReN';
            break;
        case 'kids913':
            priceId = 'price_1QWIPnKIeHEOMKlD3PgMiAms';
            break;
        case 'mma':
            priceId = 'price_1QWIQ1KIeHEOMKlDdKtPM12x';
            break;
        case 'nogi':
            priceId = 'price_1QWIQCKIeHEOMKlDpJMin5Ip';
            break;
        case 'bjjadultos':
            priceId = 'price_1QW5wcKIeHEOMKlDZ5HUPw8j';
            break;
        case 'ilimitado':
            priceId = 'price_1QWIQKKIeHEOMKlD3rBE6Goe';
            break;

        default:
            return res.send("Suscription plan not found");
    }
    //console.log(priceId);
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
        success_url: `${process.env.BASE_URL}/membresia/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/membresia/cancel`,
    });

    res.redirect(session.url);
});

membresiasRouter.get('/success', async (req, res) => {
    //console.log(">" + req.query.session_id + " " + req.user.id);
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    //console.log(JSON.stringify(session));
    const facturacion = { usuario_id: req.user.id, session_id: req.query.session_id, customer_id: session.customer, titular: session.customer_details.name, correo: session.customer_details.email, subscription: session.subscription }
    //console.log((facturacion));

    const [q] = await ExtraModel.getFacturacionByUserId(req.user.id);
    if (q) {
        //console.log("Actualizando " + q.id + ": " + q.session_id + " a  " + facturacion.session_id);
        //console.log(facturacion);
        const r = await ExtraModel.updateFacturacion(facturacion, q.id);
        console.log(r);
    } else {
        await ExtraModel.createFacturacion(facturacion);
        //console.log("Creando " + facturacion.session_id);
    }


    res.render("membresia/success");
});

membresiasRouter.get('/cancel', async (req, res) => {
    res.render("membresia/cancel");
});

membresiasRouter.post('/create-portal-session', async (req, res) => {
    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    const [q] = await ExtraModel.getFacturacionByUserId(req.user.id);
    //console.log(q);
    const checkoutSession = await stripe.checkout.sessions.retrieve(q.session_id);
    //console.log("checkoutSession");
    //console.log(checkoutSession);

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: checkoutSession.customer,
        return_url: `${process.env.BASE_URL}/usuarios/get/${q.usuario_id}`,
    });
    //console.log("portalSession");
    //console.log(portalSession);

    res.redirect(303, portalSession.url);

});

membresiasRouter.get('/clientes/:cliente_id', funciones.isAuthenticated, async (req, res) => {
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: req.params.cliente_id,
        return_url: 'http://localhost:7001/usuarios/get/' + req.params.cliente_id
    });
    //console.log(portalSession);
    res.redirect(portalSession.url);
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.

membresiasRouter.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);

    }
    console.log(event);
    // Handle the event
    switch (event.type) {
        case 'account.updated':
            const accountUpdated = event.data.object;
            // Then define and call a function to handle the event account.updated
            break;
        case 'checkout.session.completed':
            console.log("Nueva subscription empezada")
            const checkoutSessionCompleted = event.data.object;
            console.log(checkoutSessionCompleted);
            // Then define and call a function to handle the event checkout.session.completed
            break;
        case 'customer.subscription.updated':
            console.log('customer.subscription.updated');
            const customerSubscriptionUpdated = event.data.object;
            console.log(customerSubscriptionUpdated)
            // Then define and call a function to handle the event customer.subscription.updated
            break;
        case 'invoice.paid':
            console.log('Invoice correctamente pagada');
            const invoicePaid = event.data.object;
            console.log(invoicePaid);
            // Then define and call a function to handle the event invoice.paid
            break;

        case 'invoice.payment_failed':
            console.log("Pago fallido por falta de fondos o problemas de tarjeta")
            const invoicePaymentFailed = event.data.object;
            console.log(invoicePaymentFailed);
            // Then define and call a function to handle the event invoice.payment_failed
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.send();
});


