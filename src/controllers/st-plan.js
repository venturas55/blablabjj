import { PlanModel } from '../models/planMysql.js';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import { validatePlan, validatePartialPlan } from '../schemas/validaciones.js';
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_PRIV || 'PRIVATE KEY');

export class PlanController {

    static async getAll(req, res) {
        const items = await stripe.prices.list();
        console.log(items);
        res.render("planes/st-list", { items: items.data });
    }
    static async getById(req, res) {
        const { id } = req.params;
        const [actividad] = await PlanModel.getById({ id });
        console.log(actividad);
        res.render("planes/plantilla", { actividad });
    }

    static async getCreate(req, res) {
        const actividades = await stripe.products.list();
        //console.log(actividades.data);
        res.render("planes/st-add", { actividades: actividades.data });
    }

    static async create(req, res) {
        var item = req.body;
        /*    const result = validatePlan(req.body);
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        } */
       console.log(req.body);
        var itemPrice = {
            currency: 'eur',
            unit_amount: item.precio * 100,
            recurring: {
                interval: 'month',
            },
            metadata:{description: ""+item.actividades.join(',')},
        }
        console.log(itemPrice);
        const price = await stripe.prices.create(itemPrice);
        console.log(price);
        req.flash("success", "Actividad insertado correctamente");
        res.redirect("/planes/list"); //te redirige una vez insertado el item

    }

    static async delete(req, res) {
        const { id } = req.params
        console.log("deletePLan: " + JSON.stringify(id));
        const result = await PlanModel.delete({ input: id })
        if (result === false) {
            return res.status(404).json({ message: 'Actividad not found' })
        }

        //req.flash("success", "Actividad borrado correctamente");
        res.redirect("/planes/list");
    }

    static async getUpdate(req, res) {
        const { id } = req.params;
        console.log(id);
        const plan = await stripe.products.retrieve(id);
        console.log(plan);
        console.log("fin");
        res.render("plan/st-edit", { item: plan });
    }

    static async update(req, res) {
        /*  const result = validatePartialMovie(req.body)
 
         if (!result.success) {
             return res.status(400).json({ error: JSON.parse(result.error.message) })
         } */

        const { id } = req.params;
        try {
            const {
                nombre,
                descripcion,
                pictureURL
            } = req.body;
            if (typeof req.file !== 'undefined') {
                pictureURL = req.file.filename;
            }
            const newItem = {
                actividad_id: id,
                nombre,
                descripcion,
                pictureURL,
            };
            console.log(newItem);
            console.log(req.file);
            const result = await PlanModel.update({ input: newItem })
            if (result === false) {
                return res.status(404).json({ message: 'Plan not found' })
            }
            //req.flash("success", "Actividad modificada correctamente");
            res.redirect("/planes/list");
        } catch (error) {
            console.error(error.code);
            //req.flash("error", "Hubo algun error");
            res.redirect("/error");
        }

    }

}