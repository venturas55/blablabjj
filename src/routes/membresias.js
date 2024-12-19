import funciones from "../lib/funciones.js";
import { Router } from 'express';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { ExtraModel } from '../models/extraMysql.js';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_PRIV || 'PRIVATE KEY');

export const membresiasRouter = Router();

// Función para obtener las suscripciones con el nombre del plan
const getCustomerSubscriptionsWithPlan = async (customerId) => {
    try {
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'all',
        });

        let subscription = subscriptions.data;
        // Mapear las suscripciones y obtener el nombre del plan
        const subscriptionsWithPlans = await Promise.all(
            subscriptions.data.map(async (subscription) => {
                const price = subscription.items.data[0]?.price;
                const productId = price?.product;

                // Obtener el producto para obtener el nombre del plan
                const product = await stripe.products.retrieve(productId);
                subscription.planName = product.name;
                subscription.planDescription = product.description;
                /*        return {
                           subscriptionId: subscription.id,
                           status: subscription.status,
                           planName: product.name,
                           price: price.unit_amount / 100,
                           currency: price.currency,
                       }; */
                return subscription;
            })
        );

        return subscriptionsWithPlans;
    } catch (error) {
        console.error('Error al obtener las suscripciones:', error.message);
        return [];
    }
};

const getAlgo = async (subscriptions) => {
    const subscriptionsWithPlans = await Promise.all(
        subscriptions.data.map(async (subscription) => {
            const price = subscription.items.data[0]?.price;
            const productId = price?.product;

            // Obtener el producto para obtener el nombre del plan
            const product = await stripe.products.retrieve(productId);
            subscription.planName = product.name;
            subscription.planDescription = product.description;
            return subscription;
        })
    );
    return subscriptionsWithPlans;
}

const getAlgo2 = async (subscriptions) => {
    const subscriptionsWithPlans = await Promise.all(
        subscriptions.data.map(async (subscription) => {
            const price = subscription.items.data[0]?.price;
            const productId = price?.product;

            // Obtener el producto para obtener el nombre del plan
            const product = await stripe.products.retrieve(productId);
            subscription.planName = product.name;
            subscription.planDescription = product.description;
            /*        return {
                       subscriptionId: subscription.id,
                       status: subscription.status,
                       planName: product.name,
                       price: price.unit_amount / 100,
                       currency: price.currency,
                   }; */
            return subscription;
        })
    );
    return subscriptionsWithPlans;
}

// Crear una sesión de pago para una tarifa específica
membresiasRouter.get('/landing', funciones.isAuthenticated, async (req, res) => {
    const [q] = await ExtraModel.getFacturacionByUserId(req.user.id);
    var subscriptionswithplans;
    if (q) {
        const customerId = q.customer_id; // Reemplaza con el ID de cliente de tu base de datos
        subscriptionswithplans = await getCustomerSubscriptionsWithPlan(customerId);
        console.log(subscriptionswithplans);
    }
    res.render('membresia/landing', { subscriptionswithplans }); // Renderiza la vista
});

membresiasRouter.get('/list', funciones.isAuthenticated, async (req, res) => {
    /*   const subscriptions = await ExtraModel.getSubscriptions(req.user.id);
  
              // Obtener el producto para obtener el nombre del plan
              subscription.items.data[0]?.price.product;
              const product = await stripe.products.retrieve(productId);
              subscription.planName = product.name;
              subscription.planDescription = product.description; */
    console.log("La nueva lista");
    let subscriptions = await stripe.subscriptions.list({
    });
    subscriptions=subscriptions.data;
    console.log(subscriptions);
    //res.send(subscriptions.data);
    res.render('membresia/list', {subscriptions});

});




membresiasRouter.post('/create-checkout-session', funciones.isAuthenticated, async (req, res) => {
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
    //console.log(`${process.env.BASE_URL}:${process.env.PORT}/membresia/success?session_id={CHECKOUT_SESSION_ID}`);
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
        success_url: `${process.env.BASE_URL}:${process.env.PORT}/membresia/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}:${process.env.PORT}/membresia/cancel`,
    });

    res.redirect(session.url);
});

membresiasRouter.get('/success', funciones.isAuthenticated, async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    const facturacion = { usuario_id: req.user.id, session_id: req.query.session_id, customer_id: session.customer, titular: session.customer_details.name, correo: session.customer_details.email, subscription: session.subscription }
    const [q] = await ExtraModel.getFacturacionByUserId(req.user.id);
    if (q) {
        console.log("actualizando facturacion");
        const r = await ExtraModel.updateFacturacion(facturacion, q.id);
        console.log(r);
    } else {
        console.log("creando facturacion");
        await ExtraModel.createFacturacion(facturacion);
    }
    res.redirect("/landing");
});

membresiasRouter.get('/cancel', async (req, res) => {
    res.render("membresia/cancel");
});

membresiasRouter.post('/create-portal-session', funciones.isAuthenticated, async (req, res) => {
    const [q] = await ExtraModel.getFacturacionByUserId(req.user.id);
    const checkoutSession = await stripe.checkout.sessions.retrieve(q.session_id);

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: checkoutSession.customer,
        return_url: `${process.env.BASE_URL}:${process.env.PORT}/membresia/landing`,
        //return_url: `${process.env.BASE_URL}:${process.env.PORT}/usuarios/get/${q.usuario_id}`,
    });
    res.redirect(303, portalSession.url);

});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
membresiasRouter.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    console.log("webhook post de nodejs");
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


