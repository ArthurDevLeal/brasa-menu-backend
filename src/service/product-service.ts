import { ProductCreateInput, ProductUpdateInput } from "../../generated/prisma/models";
import { prisma } from "../lib/prisma";

const createProduct = async ({
  restaurantId,
  userId,
  data,
  categoryId,
}: {
  restaurantId: string;
  userId: string;
  categoryId: string;
  data: ProductCreateInput;
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

    const product = await prisma.product.create({
      data: {
        restaurantId,
        categoryId: categoryId,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl || null,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      },
      include: {
        variantCategories: {
          include: {
            variants: true,
          },
        },
        addOnCategories: {
          include: {
            addOns: true,
          },
        },
        metrics: true,
      },
    });

    await prisma.productMetric.create({
      data: {
        restaurantId,
        productId: product.id,
      },
    });

    return { success: true, data: product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
};

const getProductById = async (id: string) => {
  try {
    if (!id) {
      return { success: false, error: "Product ID is required" };
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variantCategories: {
          where: { isActive: true },
          include: {
            variants: {
              where: { isActive: true },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        addOnCategories: {
          where: { isActive: true },
          include: {
            addOns: {
              where: { isActive: true },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        metrics: true,
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Failed to fetch product" };
  }
};

const getCategoryProducts = async (categoryId: string) => {
  try {
    if (!categoryId) {
      return { success: false, error: "Category ID is required" };
    }

    const products = await prisma.product.findMany({
      where: { categoryId, isAvailable: true },
      include: {
        variantCategories: {
          where: { isActive: true },
          include: {
            variants: {
              where: { isActive: true },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        addOnCategories: {
          where: { isActive: true },
          include: {
            addOns: {
              where: { isActive: true },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        metrics: true,
      },
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
};

const getRestaurantProducts = async (restaurantId: string) => {
  try {
    if (!restaurantId) {
      return { success: false, error: "Restaurant ID is required" };
    }

    const products = await prisma.product.findMany({
      where: { restaurantId, isAvailable: true },
      include: {
        category: true,
        variantCategories: {
          where: { isActive: true },
          include: {
            variants: {
              where: { isActive: true },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        addOnCategories: {
          where: { isActive: true },
          include: {
            addOns: {
              where: { isActive: true },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        metrics: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
};

const updateProduct = async ({
  id,
  restaurantId,
  userId,
  data,
}: {
  id: string;
  restaurantId: string;
  userId: string;
  data: ProductUpdateInput;
}) => {
  try {
    if (!id || !restaurantId || !userId) {
      return { success: false, error: "Product ID, Restaurant ID and User ID are required" };
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

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    if (product.restaurantId !== restaurantId) {
      return { success: false, error: "Unauthorized" };
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
      include: {
        variantCategories: {
          include: {
            variants: true,
          },
        },
        addOnCategories: {
          include: {
            addOns: true,
          },
        },
        metrics: true,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
};

const deleteProduct = async (id: string, restaurantId: string, userId: string) => {
  try {
    if (!id || !restaurantId || !userId) {
      return { success: false, error: "Product ID, Restaurant ID and User ID are required" };
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

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    if (product.restaurantId !== restaurantId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.product.delete({
      where: { id },
    });

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
};

const toggleProductStatus = async (id: string, restaurantId: string, userId: string) => {
  try {
    if (!id || !restaurantId || !userId) {
      return { success: false, error: "Product ID, Restaurant ID and User ID are required" };
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

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    if (product.restaurantId !== restaurantId) {
      return { success: false, error: "Unauthorized" };
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        isAvailable: !product.isAvailable,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error toggling product status:", error);
    return { success: false, error: "Failed to toggle product status" };
  }
};

export {
  createProduct,
  deleteProduct,
  getCategoryProducts,
  getProductById,
  getRestaurantProducts,
  toggleProductStatus,
  updateProduct,
};