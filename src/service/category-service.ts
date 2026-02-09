import { CategoryCreateInput, CategoryUpdateInput } from "../../generated/prisma/models";
import { prisma } from "../lib/prisma";

const createCategory = async ({
  restaurantId,
  userId,
  data,
}: {
  restaurantId: string;
  userId: string;
  data: CategoryCreateInput;
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

    const category = await prisma.category.create({
      data: {
        restaurantId,
        name: data.name,
        description: data.description,
        orderIndex: data.orderIndex || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      include: {
        products: true,
      },
    });

    return { success: true, data: category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
};

const getCategoryById = async (id: string) => {
  try {
    if (!id) {
      return { success: false, error: "Category ID is required" };
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { isAvailable: true },
        },
      },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    return { success: true, data: category };
  } catch (error) {
    console.error("Error fetching category:", error);
    return { success: false, error: "Failed to fetch category" };
  }
};

const getRestaurantCategoriesWithProductCount = async (restaurantId: string) => {
  try {
    if (!restaurantId) {
      return { success: false, error: "Restaurant ID is required" };
    }

    const categories = await prisma.category.findMany({
      where: { restaurantId },
      include: {
        products: {
          where: { isAvailable: true },
          include: {
            metrics: true,
          },
        },
      },
      orderBy: { orderIndex: "asc" },
    });

    const categoriesWithStats = categories.map((category) => {
      const totalViews = category.products.reduce((sum, product) => sum + (product.metrics?.views || 0), 0);
      
      return {
        ...category,
        productCount: category.products.length,
        totalViews,
      };
    });

    const sorted = categoriesWithStats.sort((a, b) => b.totalViews - a.totalViews);

    return { success: true, data: sorted };
  } catch (error) {
    console.error("Error fetching categories with product count:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
};

const getRestaurantCategories = async (restaurantId: string) => {
  try {
    if (!restaurantId) {
      return { success: false, error: "Restaurant ID is required" };
    }

    const categories = await prisma.category.findMany({
      where: { restaurantId },
      include: {
        products: {
          where: { isAvailable: true },
        },
      },
      orderBy: { orderIndex: "asc" },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
};

const updateCategory = async ({
  id,
  restaurantId,
  userId,
  data,
}: {
  id: string;
  restaurantId: string;
  userId: string;
  data: CategoryUpdateInput;
}) => {
  try {
    if (!id || !restaurantId || !userId) {
      return { success: false, error: "Category ID, Restaurant ID and User ID are required" };
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

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    if (category.restaurantId !== restaurantId) {
      return { success: false, error: "Unauthorized" };
    }

    const updated = await prisma.category.update({
      where: { id },
      data,
      include: {
        products: true,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
};

const deleteCategory = async (id: string, restaurantId: string, userId: string) => {
  try {
    if (!id || !restaurantId || !userId) {
      return { success: false, error: "Category ID, Restaurant ID and User ID are required" };
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

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    if (category.restaurantId !== restaurantId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.category.delete({
      where: { id },
    });

    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
};

const toggleCategoryStatus = async (id: string, restaurantId: string, userId: string) => {
  try {
    if (!id || !restaurantId || !userId) {
      return { success: false, error: "Category ID, Restaurant ID and User ID are required" };
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

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    if (category.restaurantId !== restaurantId) {
      return { success: false, error: "Unauthorized" };
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        isActive: !category.isActive,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error toggling category status:", error);
    return { success: false, error: "Failed to toggle category status" };
  }
};

export {
  createCategory,
  deleteCategory,
  getCategoryById,
  getRestaurantCategories,
  getRestaurantCategoriesWithProductCount,
  toggleCategoryStatus,
  updateCategory,
};