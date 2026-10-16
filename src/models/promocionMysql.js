import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import db from "../database.js"; //db hace referencia a la BBDD
const PromocionesQuery = "select * from promociones ";
export const readJSON = (path) => require(path);

export class PromocionModel {
    static async getByUserId({ user_id }) {
      console.log("PromocionModel.getByUserId - User ID:", user_id);

    try {
      const [rows] = await db.query(PromocionesQuery + " where user_id=?", [
        user_id,
      ]);
      console.log(
        "PromocionModel.getByUserId - Results count:",
        rows?.length || 0,
      );
      return rows;
    } catch (error) {
      console.error("PromocionModel.getByUserId - Error:", error);
      throw error;
    }
  }

  static async getById({ id }) {
    try {
      console.log("PromocionModel.getById - ID:", id);
      const [rows] = await db.query(PromocionesQuery + " where id=?", [
        id,
      ]);
      console.log("PromocionModel.getById - Result:", ows);
      return rows;
    } catch (error) {
      console.error("PromocionModel.getById - Error:", error);
      throw error;
    }
  }
  static async getAll() {
    try {
      const [promociones] = await db.query(PromocionesQuery);
      return { promociones };
    } catch (error) {
      console.error("PromocionModel.getAll - Error:", error);
      throw error;
    }
  }

  static async getByClaseId({ id }) {
    try {
      //console.log("PromocionModel.getByClaseId - Class ID:", id);
      const [rows] = await db.query(PromocionesQuery + " where p.clase_id=?", [
        id,
      ]);
      //console.log("PromocionModel.getByClaseId - Results count:", rows?.length || 0);
      return rows;
    } catch (error) {
      console.error("PromocionModel.getByClaseId - Error:", error);
      throw error;
    }
  }

  static async confirmById({ promocion_id }) {
    try {
      console.log("PromocionModel.confirmById - ID:", promocion_id);
      const [result] = await db.query(
        "update promociones set promocion=true where promocion_id=?",
        [promocion_id],
      );
      console.log("PromocionModel.confirmById - Result:", result);
      return result;
    } catch (error) {
      console.error("PromocionModel.confirmById - Error:", error);
      throw error;
    }
  }

  static async cancelById({ promocion_id }) {
    try {
      console.log("PromocionModel.cancelById - ID:", promocion_id);
      const [result] = await db.query(
        "update promociones set promocion=false where promocion_id=?",
        [promocion_id],
      );
      console.log("PromocionModel.cancelById - Result:", result);
      return result;
    } catch (error) {
      console.error("PromocionModel.cancelById - Error:", error);
      throw error;
    }
  }

  static async create({ input }) {
    try {
      console.log("PromocionModel.create - Input:", input);
      const [result] = await db.query("INSERT INTO promociones set ?", [input]);
      console.log("PromocionModel.create - Result:", result);
      return result;
    } catch (error) {
      console.error("PromocionModel.create - Error:", error);
      return false;
    }
  }

  static async delete({ input }) {
    try {
      console.log("PromocionModel.delete - Input:", input);
      const [result] = await db.query(
        "DELETE FROM promociones WHERE promocion_id=?",
        [input],
      );
      console.log("PromocionModel.delete - Result:", result);
      return result;
    } catch (error) {
      console.error("PromocionModel.delete - Error:", error);
      return error;
    }
  }

  static async deleteByClaseId({ clase_id }) {
    try {
      console.log("PromocionModel.deleteByClaseId - Input:", clase_id);
      const [result] = await db.query(
        "DELETE FROM promociones WHERE clase_id=?",
        [clase_id],
      );
      console.log("PromocionModel.deleteByClaseId   - Result:", result);
      return result;
    } catch (error) {
      console.error("PromocionModel.deleteByClaseId - Error:", error);
      return error;
    }
  }
}
