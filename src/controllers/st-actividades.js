import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url);
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_PRIV || 'PRIVATE KEY');

import { validateActividad, validatePartialActividad } from '../schemas/validaciones.js';

export class ActividadStripeController {

    static async getAll(req, res) {
        const actividades = await stripe.products.list();
        res.render("actividades/st-list", { actividades: actividades.data });

    }
    static async getById(req, res) {
        const { id } = req.params;
        const [actividad] = await stripe.products.retrieve(id);
        console.log(actividad);
        res.render("actividades/plantilla", { actividad });
    }

    static async getCreate(req, res) {
        res.render("actividades/add");
    }

    static async create(req, res) {
        const result = validateActividad(req.body);


        if (!result.success) {
            // 422 Unprocessable Entity
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        console.log(result);

        const producto = {
            name: result.data.nombre,
            description: result.data.descripcion,
        };
        console.log(producto);
        const product = await stripe.products.create(producto);
        req.flash("success", "Actividad insertado correctamente");
        res.redirect("/actividades/list"); //te redirige una vez insertado el item

    }

    static async delete(req, res) {
        const { id } = req.params
        const deleted = await stripe.products.del(id);
        if (deleted === false) {
            return res.status(404).json({ message: 'Actividad not found' })
        }

        req.flash("success", "Actividad borrada correctamente");
        res.redirect("/actividades/list");
    }

    static async getUpdate(req, res) {
        const { id } = req.params;
        console.log(id);
        const actividad = await stripe.products.retrieve(id);
        console.log(actividad);
        console.log("fin");
        res.render("actividades/st-edit", { item: actividad });
    }

    static async update(req, res) {
        /*   const result = validatePartialActividad(req.body)
  
          if (!result.success) {
              return res.status(400).json({ error: JSON.parse(result.error.message) })
          } */
        const item = req.body;

        console.log(item);
        try {
            const product = await stripe.products.update(req.body.id, {
                name:item.name,
                description: item.description,

            });
            if (product === false) {
                return res.status(404).json({ message: 'Actividad not found' })
            }
            console.log(product);
            req.flash("success", "Actividad modificada correctamente");
            res.redirect("/actividades/list");
        } catch (error) {
            console.error(error);
            res.redirect("/error");
        }
    }
}