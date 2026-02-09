import { Request, Response } from "express";
import {
  createOpeningHour,
  deleteOpeningHour,
  getSettings,
  toggleOpeningHour,
  updateOpeningHour,
  updateSettings,
} from "../service/restaurant-settings-service";

export class RestaurantSettingsController {
  async show(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId } = req.params;

    const settings = await getSettings(restaurantId);
    if (!settings.success) {
      return res.status(404).json({ error: settings.error });
    }

    return res.json({
      data: settings.data,
    });
  }

  async update(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId } = req.params;
    const data = req.body;

    const settings = await updateSettings({
      restaurantId,
      userId,
      data,
    });

    if (!settings.success) {
      const statusCode = settings.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: settings.error });
    }

    return res.json({
      message: "Settings updated successfully",
      data: settings.data,
    });
  }

  async createOpeningHour(req: Request, res: Response) {
    const userId = req.userId;
    const { restaurantId } = req.params;
    const data = req.body;

    const openingHour = await createOpeningHour({
      restaurantId,
      userId,
      data,
    });

    if (!openingHour.success) {
      const statusCode = openingHour.error?.includes("Unauthorized") ? 403 : 409;
      return res.status(statusCode).json({ error: openingHour.error });
    }

    return res.status(201).json({
      message: "Opening hour created successfully",
      data: openingHour.data,
    });
  }

  async updateOpeningHour(req: Request, res: Response) {
    const userId = req.userId;
    const { settingsId, dayOfWeek } = req.params;
    const data = req.body;

    const openingHour = await updateOpeningHour({
      settingsId,
      dayOfWeek: parseInt(dayOfWeek),
      userId,
      data,
    });

    if (!openingHour.success) {
      const statusCode = openingHour.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: openingHour.error });
    }

    return res.json({
      message: "Opening hour updated successfully",
      data: openingHour.data,
    });
  }

  async deleteOpeningHour(req: Request, res: Response) {
    const userId = req.userId;
    const { settingsId, dayOfWeek } = req.params;

    const result = await deleteOpeningHour(settingsId, parseInt(dayOfWeek), userId);

    if (!result.success) {
      const statusCode = result.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: result.error });
    }

    return res.status(204).send();
  }

  async toggleOpeningHour(req: Request, res: Response) {
    const userId = req.userId;
    const { settingsId, dayOfWeek } = req.params;

    const openingHour = await toggleOpeningHour(settingsId, parseInt(dayOfWeek), userId);

    if (!openingHour.success) {
      const statusCode = openingHour.error?.includes("Unauthorized") ? 403 : 400;
      return res.status(statusCode).json({ error: openingHour.error });
    }

    return res.json({
      message: "Opening hour status updated successfully",
      data: openingHour.data,
    });
  }
}