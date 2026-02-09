import { Request, Response } from "express";
import {
  getConversionRate,
  getProductMetrics,
  getRestaurantMetrics,
  getRestaurantMetricsOverview,
  getTopProductsByAddedToCart,
  getTopProductsByViews,
  recordAddedToCart,
  recordProductView,
} from "../service/metrics-service";

export class MetricController {
  async showProductMetrics(req: Request, res: Response) {
    const { productId } = req.params;

    const metrics = await getProductMetrics(productId);
    if (!metrics.success) {
      return res.status(404).json({ error: metrics.error });
    }

    return res.json({
      data: metrics.data,
    });
  }

  async showRestaurantMetrics(req: Request, res: Response) {
    const { restaurantId } = req.params;

    const metrics = await getRestaurantMetrics(restaurantId);
    if (!metrics.success) {
      return res.status(400).json({ error: metrics.error });
    }

    return res.json({
      data: metrics.data,
    });
  }

  async topProductsByViews(req: Request, res: Response) {
    const { restaurantId } = req.params;
    const { limit = 10 } = req.query;

    const products = await getTopProductsByViews(restaurantId, parseInt(limit as string));
    if (!products.success) {
      return res.status(400).json({ error: products.error });
    }

    return res.json({
      data: products.data,
    });
  }

  async topProductsByAddedToCart(req: Request, res: Response) {
    const { restaurantId } = req.params;
    const { limit = 10 } = req.query;

    const products = await getTopProductsByAddedToCart(restaurantId, parseInt(limit as string));
    if (!products.success) {
      return res.status(400).json({ error: products.error });
    }

    return res.json({
      data: products.data,
    });
  }

  async recordView(req: Request, res: Response) {
    const { productId, restaurantId } = req.params;

    const result = await recordProductView(productId, restaurantId);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.json({
      message: "Product view recorded successfully",
      data: result.data,
    });
  }

  async recordAddToCart(req: Request, res: Response) {
    const { productId, restaurantId } = req.params;

    const result = await recordAddedToCart(productId, restaurantId);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.json({
      message: "Product added to cart recorded successfully",
      data: result.data,
    });
  }

  async showConversionRate(req: Request, res: Response) {
    const { productId } = req.params;

    const rate = await getConversionRate(productId);
    if (!rate.success) {
      return res.status(404).json({ error: rate.error });
    }

    return res.json({
      data: rate.data,
    });
  }

  async overview(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId } = req.params;

    const overview = await getRestaurantMetricsOverview(restaurantId, userId);
    if (!overview.success) {
      const statusCode = overview.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: overview.error });
    }

    return res.json({
      data: overview.data,
    });
  }
}