import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getCategoryProducts,
  getProductById,
  getRestaurantProducts,
  toggleProductStatus,
  updateProduct,
} from "../service/product-service";

export class ProductController {
  async store(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, categoryId } = req.params;
    const data = req.body;

    const product = await createProduct({
      restaurantId,
      userId,
      categoryId,
      data,
    });

    if (!product.success) {
      const statusCode = product.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: product.error });
    }

    return res.status(201).json({
      message: "Product created successfully",
      data: product.data,
    });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const product = await getProductById(id);
    if (!product.success) {
      return res.status(404).json({ error: product.error });
    }

    return res.json({
      data: product.data,
    });
  }

  async indexByCategory(req: Request, res: Response) {
    const { categoryId } = req.params;

    const products = await getCategoryProducts(categoryId);
    if (!products.success) {
      return res.status(400).json({ error: products.error });
    }

    return res.json({
      data: products.data,
    });
  }

  async indexByRestaurant(req: Request, res: Response) {
    const { restaurantId } = req.params;

    const products = await getRestaurantProducts(restaurantId);
    if (!products.success) {
      return res.status(400).json({ error: products.error });
    }

    return res.json({
      data: products.data,
    });
  }

  async update(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, id } = req.params;
    const data = req.body;

    const product = await updateProduct({
      id,
      restaurantId,
      userId,
      data,
    });

    if (!product.success) {
      const statusCode = product.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: product.error });
    }

    return res.json({
      message: "Product updated successfully",
      data: product.data,
    });
  }

  async delete(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, id } = req.params;

    const result = await deleteProduct(id, restaurantId, userId);

    if (!result.success) {
      const statusCode = result.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: result.error });
    }

    return res.status(204).send();
  }

  async toggleStatus(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId, id } = req.params;

    const product = await toggleProductStatus(id, restaurantId, userId);

    if (!product.success) {
      const statusCode = product.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: product.error });
    }

    return res.json({
      message: "Product status updated successfully",
      data: product.data,
    });
  }
}