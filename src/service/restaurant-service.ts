import { RestaurantCreateInput, RestaurantUpdateInput } from "../../generated/prisma/models";
import { prisma } from "../lib/prisma";

const createRestaurant = async ({ input, userId }: { input: RestaurantCreateInput; userId: string }) => {
  try {
    if (!userId || !input.name || !input.slug || !input.address || !input.phone) {
      return {
        success: false,
        error: "userId, name, slug, address, and phone are required",
      };
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return { success: false, error: "User not found" };
    }

    const slugExists = await prisma.restaurant.findUnique({
      where: { slug: input.slug },
    });

    if (slugExists) {
      return { success: false, error: "Restaurant slug already in use" };
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        userId,
        name: input.name,
        slug: input.slug,
        address: input.address,
        phone: input.phone,
        description: input.description || null,
        logoUrl: input.logoUrl || null,
        logoPath: null,
        bannerUrl: input.bannerUrl || null,
        bannerPath: null,
      },
      include: {
        settings: true,
      },
    });

    await prisma.restaurantSettings.create({
      data: {
        restaurantId: restaurant.id,
      },
    });

    return { success: true, data: restaurant };
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return { success: false, error: "Failed to create restaurant" };
  }
};

const getRestaurantById = async (id: string) => {
  try {
    if (!id) {
      return { success: false, error: "Restaurant ID is required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        settings: {
          include: {
            openingHours: true,
          },
        },
        categories: {
          where: { isActive: true },
          orderBy: { orderIndex: "asc" },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!restaurant) {
      return { success: false, error: "Restaurant not found" };
    }

    return { success: true, data: restaurant };
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return { success: false, error: "Failed to fetch restaurant" };
  }
};

const getRestaurantBySlug = async (slug: string) => {
  try {
    if (!slug) {
      return { success: false, error: "Restaurant slug is required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        settings: {
          include: {
            openingHours: true,
          },
        },
        categories: {
          where: { isActive: true },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!restaurant) {
      return { success: false, error: "Restaurant not found" };
    }

    return { success: true, data: restaurant };
  } catch (error) {
    console.error("Error fetching restaurant by slug:", error);
    return { success: false, error: "Failed to fetch restaurant" };
  }
};

const getUserRestaurants = async (userId: string) => {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    const restaurants = await prisma.restaurant.findMany({
      where: { userId },
      include: {
        settings: true,
        _count: {
          select: {
            categories: true,
            products: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: restaurants };
  } catch (error) {
    console.error("Error fetching user restaurants:", error);
    return { success: false, error: "Failed to fetch restaurants" };
  }
};

const updateRestaurant = async ({ input, userId }: { input: { where: { id: string }; data: RestaurantUpdateInput }; userId: string }) => {
  try {
    const { data, where } = input;

    if (!where.id || !userId) {
      return { success: false, error: "Restaurant ID and User ID are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: where.id },
    });

    if (!restaurant) {
      return { success: false, error: "Restaurant not found" };
    }

    if (restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized to update this restaurant" };
    }

    const updateData: Record<string, any> = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.slug !== undefined) {
      updateData.slug = data.slug;
    }
    if (data.address !== undefined) {
      updateData.address = data.address;
    }
    if (data.phone !== undefined) {
      updateData.phone = data.phone;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.logoUrl !== undefined) {
      updateData.logoUrl = data.logoUrl === null ? null : data.logoUrl;
    }
    if ((data as any).logoPath !== undefined) {
      updateData.logoPath = (data as any).logoPath === null ? null : (data as any).logoPath;
    }
    if (data.bannerUrl !== undefined) {
      updateData.bannerUrl = data.bannerUrl === null ? null : data.bannerUrl;
    }
    if ((data as any).bannerPath !== undefined) {
      updateData.bannerPath = (data as any).bannerPath === null ? null : (data as any).bannerPath;
    }
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }


    const updated = await prisma.restaurant.update({
      where: { id: where.id },
      data: updateData,
      include: {
        settings: true,
      },
    });

   
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return { success: false, error: "Failed to update restaurant" };
  }
};

const deleteRestaurant = async (id: string, userId: string) => {
  try {
    if (!id || !userId) {
      return { success: false, error: "Restaurant ID and User ID are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      return { success: false, error: "Restaurant not found" };
    }

    if (restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized to delete this restaurant" };
    }

    await prisma.restaurant.delete({
      where: { id },
    });

    return { success: true, message: "Restaurant deleted successfully" };
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return { success: false, error: "Failed to delete restaurant" };
  }
};

const toggleRestaurantStatus = async (id: string, userId: string) => {
  try {
    if (!id || !userId) {
      return { success: false, error: "Restaurant ID and User ID are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      return { success: false, error: "Restaurant not found" };
    }

    if (restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized to update this restaurant" };
    }

    const updated = await prisma.restaurant.update({
      where: { id },
      data: {
        isActive: !restaurant.isActive,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error toggling restaurant status:", error);
    return { success: false, error: "Failed to toggle restaurant status" };
  }
};

export {
  createRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getRestaurantBySlug,
  getUserRestaurants,
  toggleRestaurantStatus,
  updateRestaurant,
};