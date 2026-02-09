import { Request, Response } from "express";
import {
  createAddOn,
  createAddOnCategory,
  deleteAddOn,
  deleteAddOnCategory,
  updateAddOn,
  updateAddOnCategory,
} from "../service/add-ons-service";

export class AddOnController {
  async storeCategory(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, productId } = req.params;
    const data = req.body;

    const addOnCategory = await createAddOnCategory({
      productId,
      restaurantId,
      userId,
      data,
    });

    if (!addOnCategory.success) {
      const statusCode = addOnCategory.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: addOnCategory.error });
    }

    return res.status(201).json({
      message: "AddOn category created successfully",
      data: addOnCategory.data,
    });
  }

  async updateCategory(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, productId, id } = req.params;
    const data = req.body;

    const addOnCategory = await updateAddOnCategory({
      id,
      productId,
      restaurantId,
      userId,
      data,
    });

    if (!addOnCategory.success) {
      const statusCode = addOnCategory.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: addOnCategory.error });
    }

    return res.json({
      message: "AddOn category updated successfully",
      data: addOnCategory.data,
    });
  }

  async deleteCategory(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, productId, id } = req.params;

    const result = await deleteAddOnCategory(id, productId, restaurantId, userId);

    if (!result.success) {
      const statusCode = result.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: result.error });
    }

    return res.status(204).send();
  }

  async store(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, productId, addOnCategoryId } = req.params;
    const data = req.body;

    const addOn = await createAddOn({
      addOnCategoryId,
      productId,
      restaurantId,
      userId,
      data,
    });

    if (!addOn.success) {
      const statusCode = addOn.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: addOn.error });
    }

    return res.status(201).json({
      message: "AddOn created successfully",
      data: addOn.data,
    });
  }

  async update(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, addOnCategoryId, id } = req.params;
    const data = req.body;

    const addOn = await updateAddOn({
      id,
      addOnCategoryId,
      restaurantId,
      userId,
      data,
    });

    if (!addOn.success) {
      const statusCode = addOn.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: addOn.error });
    }

    return res.json({
      message: "AddOn updated successfully",
      data: addOn.data,
    });
  }

  async delete(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, addOnCategoryId, id } = req.params;

    const result = await deleteAddOn(id, addOnCategoryId, restaurantId, userId);

    if (!result.success) {
      const statusCode = result.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: result.error });
    }

    return res.status(204).send();
  }
}