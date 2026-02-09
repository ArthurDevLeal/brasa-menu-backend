import { Request, Response } from "express";
import {
  createVariant,
  createVariantCategory,
  deleteVariant,
  deleteVariantCategory,
  updateVariant,
  updateVariantCategory,
} from "../service/variant-service";

export class VariantController {
  async storeCategory(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, productId } = req.params;
    const data = req.body;

    const variantCategory = await createVariantCategory({
      productId,
      restaurantId,
      userId,
      data,
    });

    if (!variantCategory.success) {
      const statusCode = variantCategory.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: variantCategory.error });
    }

    return res.status(201).json({
      message: "Variant category created successfully",
      data: variantCategory.data,
    });
  }

  async updateCategory(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, productId, id } = req.params;
    const data = req.body;

    const variantCategory = await updateVariantCategory({
      id,
      productId,
      restaurantId,
      userId,
      data,
    });

    if (!variantCategory.success) {
      const statusCode = variantCategory.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: variantCategory.error });
    }

    return res.json({
      message: "Variant category updated successfully",
      data: variantCategory.data,
    });
  }

  async deleteCategory(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, productId, id } = req.params;

    const result = await deleteVariantCategory(id, productId, restaurantId, userId);

    if (!result.success) {
      const statusCode = result.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: result.error });
    }

    return res.status(204).send();
  }

  async store(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, productId, variantCategoryId } = req.params;
    const data = req.body;

    const variant = await createVariant({
      variantCategoryId,
      productId,
      restaurantId,
      userId,
      data,
    });

    if (!variant.success) {
      const statusCode = variant.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: variant.error });
    }

    return res.status(201).json({
      message: "Variant created successfully",
      data: variant.data,
    });
  }

  async update(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, variantCategoryId, id } = req.params;
    const data = req.body;

    const variant = await updateVariant({
      id,
      variantCategoryId,
      restaurantId,
      userId,
      data,
    });

    if (!variant.success) {
      const statusCode = variant.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: variant.error });
    }

    return res.json({
      message: "Variant updated successfully",
      data: variant.data,
    });
  }

  async delete(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, variantCategoryId, id } = req.params;

    const result = await deleteVariant(id, variantCategoryId, restaurantId, userId);

    if (!result.success) {
      const statusCode = result.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: result.error });
    }

    return res.status(204).send();
  }
}