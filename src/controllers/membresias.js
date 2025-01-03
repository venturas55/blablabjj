
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url);
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { MembresiaModel } from "../models/membresiaMysql.js";
import { ExtraModel } from "../models/extraMysql.js";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_PRIV || 'PRIVATE KEY');


import { validateMembresia, validatePartialMembresia } from '../schemas/validaciones.js';

// Función para obtener las suscripciones con el nombre del plan
const getCustomerSubscriptionsWithPlan = async (customerId) => {
    try {
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'all',
        });

        //let subscription = subscriptions.data;
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

export class MembresiaController {

    static async getLanding(req, res) {
        const [q] = await MembresiaModel.getMembresiaByUserId(req.user.id);
        var subscriptionswithplans;
        if (q) {
            const customerId = q.customer_id; // Reemplaza con el ID de cliente de tu base de datos
            subscriptionswithplans = await getCustomerSubscriptionsWithPlan(customerId);
            console.log(subscriptionswithplans);
        }
        res.render('membresia/landing', { subscriptionswithplans }); // Renderiza la vista
    }

    static async getList(req, res) {

        let subscriptions = await stripe.subscriptions.list({
        });

        console.log(subscriptions);
        const balance = await stripe.balance.retrieve();

        const balanceTransactions = await stripe.balanceTransactions.list();
        //console.log(balanceTransactions);
        subscriptions = subscriptions.data;
        try {
            // Mapear las suscripciones y obtener el nombre del plan
            const subscriptionsWithPlans = await Promise.all(
                subscriptions.map(async (subscription) => {
                    const productId = subscription.plan.product;
                    const customerId = subscription.customer;

                    // Obtener el producto para obtener el nombre del plan
                    const product = await stripe.products.retrieve(productId);
                    const customer = await stripe.customers.retrieve(customerId);
                    //console.log(customer);




                    subscription.planName = product.name;
                    subscription.planDescription = product.description;
                    subscription.customer = customer;
                    /*              subscription.customerName = customer.created;
                                 subscription.customerName = customer.email;
                                 subscription.customerName = customer.name;
                                 subscription.customerName = customer.prhone; */

                    //console.log(subscription);

                    return subscription;

                })
            );

            res.render('membresia/list', { subscriptions: subscriptionsWithPlans, balance, balanceTransactions });
        } catch (error) {
            console.error('Error al obtener las suscripciones:', error.message);
            return [];
        }
    }

    static async getCheckOutSession(req, res) {
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

        res.redirect(session.url)//+"?prefilled_email="+req.user.email);

    }
    static async getSuccess(req, res) {

        const session = await stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['line_items.data.price'] });
        //console.log(session.line_items.data[0].price.id);
        const facturacion = { usuario_id: req.user.id, session_id: req.query.session_id, customer_id: session.customer, titular: session.customer_details.name, correo: session.customer_details.email, subscription: session.subscription, hasAccess: true, price_id: session.line_items.data[0].price.id };
        const [q] = await MembresiaModel.getMembresiaByUserId(req.user.id);
        if (q) {
            console.log("actualizando facturacion");
            const r = await MembresiaModel.updateMembresia(facturacion, q.id);
        } else {
            console.log("creando facturacion");
            await MembresiaModel.createMembresia(facturacion);
        }

        //console.log(req.query);

        res.redirect("/membresia/landing");



    }

    static async postCancel(req, res) {
        const { id } = req.params
        console.log(req.params);

        const subscription = await stripe.subscriptions.update
            (
                id
                ,
                {
                    cancel_at_period_end: true,
                }
            );
        res.redirect('/membresia/list');
    }

    static async postResume(req, res) {
        const { id } = req.params
        console.log(req.params);

        const subscription = await stripe.subscriptions.update(id, { cancel_at_period_end: false });
        res.redirect('/membresia/list');
    }

    static async createPortal(req, res) {
        const [q] = await MembresiaModel.getMembresiaByUserId(req.user.id);
        //const checkoutSession = await stripe.checkout.sessions.retrieve(q.session_id);
        //console.log(q.customer_id);
        //console.log(checkoutSession.customer);
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: q.customer_id,
            return_url: `${process.env.BASE_URL}:${process.env.PORT}/membresia/landing`,
            //return_url: `${process.env.BASE_URL}:${process.env.PORT}/usuarios/get/${q.usuario_id}`,
        });
        res.redirect(303, portalSession.url + "?prefilled_email=" + req.user.email);

    }

    // This is your Stripe CLI webhook secret for testing your endpoint locally.
    static async webhook(req, res) {
        const signat = req.headers['stripe-signature'];
        console.log("webhook post de nodejs");

        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, signat, process.env.STRIPE_WEBHOOK_SECRET_KEY);
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);

        }
        const checkoutSessionCompleted = event.data.object;
        console.log("webhook checkoutSessionCompleted");
        console.log(checkoutSessionCompleted);

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                console.log("Nueva subscription empezada")
                // session = await stripe.checkout.sessions.retrieve(req.query.session_id);


                //const customer = await stripe.customers.retrieve(customer_id);

                /*             let facturacion = { session_id: checkoutSessionCompleted.id, customer_id:checkoutSessionCompleted.customer, titular: checkoutSessionCompleted.customer_details.name, correo: checkoutSessionCompleted.customer_details.email, subscription: checkoutSessionCompleted.subscription,hasAccess:true }
                            const [q] = await MembresiaModel.getMembresiaByEmail(facturacion.correo);
                            if (q) {
                                console.log("actualizando facturacion");
                                facturacion.id = q.id;
                                const r = await MembresiaModel.updateMembresia(facturacion);
                                console.log(r);
                            } else {
                                console.log("creando facturacion");
                                await MembresiaModel.createMembresia(facturacion);
                            } */

                // Then define and call a function to handle the event checkout.session.completed
                break;
            case 'customer.subscription.updated':
                console.log('customer.subscription.updated');
                console.log('customer.subscription.updated');
                const customerSubscriptionUpdated = event.data.object;
                console.log(customerSubscriptionUpdated)
                // Then define and call a function to handle the event customer.subscription.updated
                break;

            case 'customer.subscription.deleted':
                console.log("Se borro una subscripcion!!");
                const subscription = await stripe.subscriptions.retrieve(event.data.object.id);
                //revoke access to the subscription
                let usuario = await MembresiaModel.getMembresiaByCostumerId(subscription.customer);
                usuario.hasAccess = false;
                const a = await MembresiaModel.updateMembresia(usuario);
                break;
            case 'account.updated':
                const accountUpdated = event.data.object;
                // Then define and call a function to handle the event account.updated
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
            case 'billing_portal.session.created':
                console.log("Billing portal creadito");
                const invoiceCreated = event.data.object;
                console.log(invoiceCreated);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        console.log(`Unhandled event type ${event.type}`);
        res.send();

    }

    static async traerProductos(req, res) {
        const q1 = await ExtraModel.deleteProducts();
        const products = await stripe.products.list();
        var productos = [];
        products.data.forEach((product) => {
            productos.push([product.name, product.description, product.id, product.default_price]);
        });
        //console.log(productos);
        const q2 = await ExtraModel.insertProducts(productos);
    }

    static async pruebas(req, res) {
        /*        const subscription  = await stripe.subscriptions.retrieve("sub_1QYGN6KIeHEOMKlDamj1m8Od");
               const priceId = subscription.items.data[0].price.id;
               console.log(priceId);
               const price = await stripe.prices.retrieve(priceId);
               const productId = price.product;
               console.log(productId); */
        //const facturacion = { usuario_id: req.user.id, session_id: req.query.session_id, customer_id: session.customer, titular: session.customer_details.name, correo: session.customer_details.email, subscription: session.subscription, hasAccess: true }
        //const [q] = await MembresiaModel.getMembresiaByUserId(req.user.id);
    }
}