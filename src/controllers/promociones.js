import { PromocionModel } from "../models/promocionMysql.js";
import { UsuarioModel } from "../models/usuarioMysql.js";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import {
  validatePromocion,
  validatePartialPromocion,
} from "../schemas/validaciones.js";

export class PromocionController {
  static async getByUserId(req, res) {
    const { user_id } = req.params;
    const usuario = await UsuarioModel.getById({ id: user_id });
    const promociones = await PromocionModel.getByUserId({user_id});
    console.log(usuario);
    console.log(promociones);
    res.render("promociones/index", { promociones, usuario });
  }

  static async getById(req, res) {
    const { id } = req.params;
    const promociones = await PromocionModel.getById(id);
    res.render("promociones/plantilla", { promociones });
  }
  static async create(req, res) {
    const item = {
      user_id: req.body.user_id,
      belt: req.body.belt,
      stripes: req.body.stripes,
      promotion_date: req.body.promotion_date,
      //promoted_by: req.body.promoted_by,
      notes: req.body.notes,
    };
    console.log(item);
    const a = await PromocionModel.create({ input: item });
    req.flash("success", "Solicitud realizada correctamente");
    res.redirect("/promociones/list/" + item.user_id); //te redirige una vez insertado el item
  }
  static async getAll(req, res) {
    const { promociones, ranking } = await PromocionModel.getAll();
    console.log(ranking);
    res.render("promociones/list", { promociones, ranking });
  }

  static async confirmById(req, res) {
    const { promocion_id, clase_id } = req.body;
    console.log(promocion_id + " " + clase_id);
    const item = await PromocionModel.confirmById({ promocion_id });
    res.redirect("/clases/ver/" + clase_id);
  }

  static async cancelById(req, res) {
    const { promocion_id, clase_id } = req.body;
    const item = await PromocionModel.cancelById({ promocion_id });
    res.redirect("/clases/ver/" + clase_id);
  }

  static async delete(req, res) {
    const { promocion_id } = req.params;
    const [clase] = await PromocionModel.getById({ id: promocion_id });
    const result = await PromocionModel.delete({ input: promocion_id });
    if (result === false) {
      return res.status(404).json({ message: "Promocion not found" });
    }
    req.flash("success", "Promocion borrada correctamente");
    res.redirect("/clases/ver/" + clase.clase_id); //te redirige una vez insertado el item
  }

  static async getUpdate(req, res) {
    const { promocion_id } = req.params;
    const [item] = await db.query(
      "SELECT * FROM promociones WHERE promocion_id=?",
      [promocion_id],
    );
    res.render("promociones/list", { item });
  }
  static async update(req, res) {
    /*  const result = validatePartialMovie(req.body)
 
         if (!result.success) {
             return res.status(400).json({ error: JSON.parse(result.error.message) })
         } */
    try {
      const { anuncio_id } = req.params;
      const { actividad_ofrecida_id, duracion, fecha_hora, salario_propuesto } =
        req.body;
      const item = {
        anuncio_id,
        actividad_ofrecida_id,
        duracion,
        fecha_hora,
        salario_propuesto,
        creador_id: req.user.id,
      };
      console.log(anuncio_id);
      console.log(item);
      const result = await AsistenciaModel.update({ input: item });
      if (result === false) {
        return res.status(404).json({ message: "anuncio not found" });
      }
      //req.flash("success", "Actividad modificada correctamente");
      res.redirect("/anuncios/list");
    } catch (error) {
      console.error(error.code);
      //req.flash("error", "Hubo algun error");
      res.redirect("/error");
    }
  }
}
