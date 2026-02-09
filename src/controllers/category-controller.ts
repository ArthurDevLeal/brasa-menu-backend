import { Request, Response } from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getRestaurantCategories,
  getRestaurantCategoriesWithProductCount,
  toggleCategoryStatus,
  updateCategory,
} from "../service/category-service";

export class CategoryController {
  async store(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId } = req.params;
    const data = req.body;

    const category = await createCategory({
      restaurantId,
      userId,
      data,
    });

    if (!category.success) {
      const statusCode = category.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: category.error });
    }

    return res.status(201).json({
      message: "Category created successfully",
      data: category.data,
    });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const category = await getCategoryById(id);
    if (!category.success) {
      return res.status(404).json({ error: category.error });
    }

    return res.json({
      data: category.data,
    });
  }

  async indexWithProductCount(req: Request, res: Response) {
    const { restaurantId } = req.params;
    const categories = await getRestaurantCategoriesWithProductCount(restaurantId);
    if (!categories.success) {
      return res.status(400).json({ error: categories.error });
    }
    return res.json({
      data: categories.data,
    });
  }
  async index(req: Request, res: Response) {
    const { restaurantId } = req.params;

    const categories = await getRestaurantCategories(restaurantId);
    if (!categories.success) {
      return res.status(400).json({ error: categories.error });
    }

    return res.json({
      data: categories.data,
    });
  }

  async update(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, id } = req.params;
    const data = req.body;

    const category = await updateCategory({
      id,
      restaurantId,
      userId,
      data,
    });

    if (!category.success) {
      const statusCode = category.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: category.error });
    }

    return res.json({
      message: "Category updated successfully",
      data: category.data,
    });
  }

  async delete(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, id } = req.params;

    const result = await deleteCategory(id, restaurantId, userId);

    if (!result.success) {
      const statusCode = result.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: result.error });
    }

    return res.status(204).send();
  }

  async toggleStatus(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, id } = req.params;

    const category = await toggleCategoryStatus(id, restaurantId, userId);

    if (!category.success) {
      const statusCode = category.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: category.error });
    }

    return res.json({
      message: "Category status updated successfully",
      data: category.data,
    });
  }
}
