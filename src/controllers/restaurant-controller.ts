import { Request, Response } from "express";
import { RestaurantCreateInput, RestaurantUpdateInput } from "../../generated/prisma/models";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getRestaurantBySlug,
  getUserRestaurants,
  toggleRestaurantStatus,
  updateRestaurant,
} from "../service/restaurant-service";

export class RestaurantController {
  async store(req: Request, res: Response) {
    const userId = req.userId;
    const data: RestaurantCreateInput = req.body;

    const restaurantExists = await getRestaurantBySlug(data.slug);
    if (restaurantExists.success) {
      return res.status(409).json({ error: "Restaurant slug already in use" });
    }

    const restaurantReq = await createRestaurant({ input: data, userId });
    if (!restaurantReq.success) {
      return res.status(400).json({ error: restaurantReq.error || "Error creating restaurant" });
    }

    return res.status(201).json({
      message: "Restaurant created successfully",
      data: restaurantReq.data,
    });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const restaurant = await getRestaurantById(id);
    if (!restaurant.success) {
      return res.status(404).json({ error: restaurant.error });
    }

    return res.json({
      message: "Restaurant showed successfully",
      data: restaurant.data,
    });
  }

  async showBySlug(req: Request, res: Response) {
    const { slug } = req.params;

    const restaurant = await getRestaurantBySlug(slug);
    if (!restaurant.success) {
      return res.status(404).json({ error: restaurant.error });
    }

    return res.json({
      message: "Restaurant showed by slug successfully",
      data: restaurant.data,
    });
  }

  async index(req: Request, res: Response) {
    const userId = req.userId;

    const restaurants = await getUserRestaurants(userId);
    if (!restaurants.success) {
      return res.status(400).json({ error: restaurants.error });
    }

    return res.json({
      message: "Restaurant indexed successfully",
      data: restaurants.data,
    });
  }

  async update(req: Request, res: Response) {
    const userId = req.userId;
    const { id } = req.params;
    const data: RestaurantUpdateInput = req.body;

    const updateInput = {
      where: { id },
      data: { id, ...data },
    };

    const restaurant = await updateRestaurant({ input: updateInput, userId });
    if (!restaurant.success) {
      const statusCode = restaurant.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: restaurant.error });
    }

    return res.json({
      message: "Restaurant updated successfully",
      data: restaurant.data,
    });
  }

  async delete(req: Request, res: Response) {
    const userId = req.userId;
    const { id } = req.params;

    const restaurant = await deleteRestaurant(id, userId);
    if (!restaurant.success) {
      const statusCode = restaurant.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: restaurant.error });
    }

    return res.status(204).send();
  }

  async toggleStatus(req: Request, res: Response) {
    const userId = req.userId;
    const { id } = req.params;

    const restaurant = await toggleRestaurantStatus(id, userId);
    if (!restaurant.success) {
      const statusCode = restaurant.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: restaurant.error });
    }

    return res.json({
      message: "Restaurant status updated successfully",
      data: restaurant.data,
    });
  }
}
