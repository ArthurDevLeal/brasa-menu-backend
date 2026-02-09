import {
  OpeningHourCreateInput,
  OpeningHourUpdateInput,
  RestaurantSettingsUpdateInput,
} from "../../generated/prisma/models";
import { prisma } from "../lib/prisma";

const getSettings = async (restaurantId: string) => {
  try {
    if (!restaurantId) {
      return { success: false, error: "Restaurant ID is required" };
    }

    const settings = await prisma.restaurantSettings.findUnique({
      where: { restaurantId },
      include: {
        openingHours: {
          orderBy: { dayOfWeek: "asc" },
        },
      },
    });

    if (!settings) {
      return { success: false, error: "Settings not found" };
    }

    return { success: true, data: settings };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { success: false, error: "Failed to fetch settings" };
  }
};

const updateSettings = async ({
  restaurantId,
  userId,
  data,
}: {
  restaurantId: string;
  userId: string;
  data: RestaurantSettingsUpdateInput;
}) => {
  try {
    if (!restaurantId || !userId) {
      return { success: false, error: "Restaurant ID and User ID are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return { success: false, error: "Restaurant not found" };
    }

    if (restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized to update these settings" };
    }

    const updated = await prisma.restaurantSettings.update({
      where: { restaurantId },
      data,
      include: {
        openingHours: {
          orderBy: { dayOfWeek: "asc" },
        },
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
};

const createOpeningHour = async ({
  restaurantId,
  userId,
  data,
}: {
  restaurantId: string;
  userId: string;
  data: OpeningHourCreateInput;
}) => {
  try {
    if (!restaurantId || !userId) {
      return { success: false, error: "Restaurant ID and User ID are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return { success: false, error: "Restaurant not found" };
    }

    if (restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const settings = await prisma.restaurantSettings.findUnique({
      where: { restaurantId },
    });

    if (!settings) {
      return { success: false, error: "Settings not found" };
    }

    const existingHour = await prisma.openingHour.findUnique({
      where: {
        settingsId_dayOfWeek: {
          settingsId: settings.id,
          dayOfWeek: data.dayOfWeek,
        },
      },
    });

    if (existingHour) {
      return { success: false, error: "Opening hour already exists for this day" };
    }

    const openingHour = await prisma.openingHour.create({
      data: {
        closesAt: data.closesAt,
        opensAt: data.opensAt,
        dayOfWeek: data.dayOfWeek,
        settingsId: settings.id,
      },
    });

    return { success: true, data: openingHour };
  } catch (error) {
    console.error("Error creating opening hour:", error);
    return { success: false, error: "Failed to create opening hour" };
  }
};

const updateOpeningHour = async ({
  settingsId,
  dayOfWeek,
  userId,
  data,
}: {
  settingsId: string;
  dayOfWeek: number;
  userId: string;
  data: OpeningHourUpdateInput;
}) => {
  try {
    if (!settingsId || !userId) {
      return { success: false, error: "Settings ID and User ID are required" };
    }

    const settings = await prisma.restaurantSettings.findUnique({
      where: { id: settingsId },
      include: {
        restaurant: true,
      },
    });

    if (!settings) {
      return { success: false, error: "Settings not found" };
    }

    if (settings.restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const openingHour = await prisma.openingHour.findUnique({
      where: {
        settingsId_dayOfWeek: {
          settingsId,
          dayOfWeek,
        },
      },
    });

    if (!openingHour) {
      return { success: false, error: "Opening hour not found" };
    }

    const updated = await prisma.openingHour.update({
      where: {
        settingsId_dayOfWeek: {
          settingsId,
          dayOfWeek,
        },
      },
      data,
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating opening hour:", error);
    return { success: false, error: "Failed to update opening hour" };
  }
};

const deleteOpeningHour = async (settingsId: string, dayOfWeek: number, userId: string) => {
  try {
    if (!settingsId || !userId) {
      return { success: false, error: "Settings ID and User ID are required" };
    }

    const settings = await prisma.restaurantSettings.findUnique({
      where: { id: settingsId },
      include: {
        restaurant: true,
      },
    });

    if (!settings) {
      return { success: false, error: "Settings not found" };
    }

    if (settings.restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.openingHour.delete({
      where: {
        settingsId_dayOfWeek: {
          settingsId,
          dayOfWeek,
        },
      },
    });

    return { success: true, message: "Opening hour deleted successfully" };
  } catch (error) {
    console.error("Error deleting opening hour:", error);
    return { success: false, error: "Failed to delete opening hour" };
  }
};

const toggleOpeningHour = async (settingsId: string, dayOfWeek: number, userId: string) => {
  try {
    if (!settingsId || !userId) {
      return { success: false, error: "Settings ID and User ID are required" };
    }

    const settings = await prisma.restaurantSettings.findUnique({
      where: { id: settingsId },
      include: {
        restaurant: true,
      },
    });

    if (!settings) {
      return { success: false, error: "Settings not found" };
    }

    if (settings.restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const openingHour = await prisma.openingHour.findUnique({
      where: {
        settingsId_dayOfWeek: {
          settingsId,
          dayOfWeek,
        },
      },
    });

    if (!openingHour) {
      return { success: false, error: "Opening hour not found" };
    }

    const updated = await prisma.openingHour.update({
      where: {
        settingsId_dayOfWeek: {
          settingsId,
          dayOfWeek,
        },
      },
      data: {
        isOpen: !openingHour.isOpen,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error toggling opening hour:", error);
    return { success: false, error: "Failed to toggle opening hour" };
  }
};

export { createOpeningHour, deleteOpeningHour, getSettings, updateOpeningHour, updateSettings, toggleOpeningHour };