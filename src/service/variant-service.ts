import {
  VariantCategoryCreateInput,
  VariantCategoryUpdateInput,
  VariantCreateInput,
  VariantUpdateInput,
} from "../../generated/prisma/models";
import { prisma } from "../lib/prisma";

const createVariantCategory = async ({
  productId,
  restaurantId,
  userId,
  data,
}: {
  productId: string;
  restaurantId: string;
  userId: string;
  data: VariantCategoryCreateInput;
}) => {
  try {
    if (!productId || !restaurantId || !userId) {
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
      where: { id: productId },
    });

    if (!product || product.restaurantId !== restaurantId) {
      return { success: false, error: "Product not found" };
    }

    const variantCategory = await prisma.variantCategory.create({
      data: {
        productId,
        name: data.name,
        orderIndex: data.orderIndex || 0,
      },
      include: {
        variants: true,
      },
    });

    return { success: true, data: variantCategory };
  } catch (error) {
    console.error("Error creating variant category:", error);
    return { success: false, error: "Failed to create variant category" };
  }
};

const updateVariantCategory = async ({
  id,
  productId,
  restaurantId,
  userId,
  data,
}: {
  id: string;
  productId: string;
  restaurantId: string;
  userId: string;
  data: VariantCategoryUpdateInput;
}) => {
  try {
    if (!id || !productId || !restaurantId || !userId) {
      return { success: false, error: "ID, Product ID, Restaurant ID and User ID are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const variantCategory = await prisma.variantCategory.findUnique({
      where: { id },
    });

    if (!variantCategory || variantCategory.productId !== productId) {
      return { success: false, error: "Variant category not found" };
    }

    const updated = await prisma.variantCategory.update({
      where: { id },
      data,
      include: {
        variants: true,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating variant category:", error);
    return { success: false, error: "Failed to update variant category" };
  }
};

const deleteVariantCategory = async (id: string, productId: string, restaurantId: string, userId: string) => {
  try {
    if (!id || !productId || !restaurantId || !userId) {
      return { success: false, error: "ID, Product ID, Restaurant ID and User ID are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const variantCategory = await prisma.variantCategory.findUnique({
      where: { id },
    });

    if (!variantCategory || variantCategory.productId !== productId) {
      return { success: false, error: "Variant category not found" };
    }

    await prisma.variantCategory.delete({
      where: { id },
    });

    return { success: true, message: "Variant category deleted successfully" };
  } catch (error) {
    console.error("Error deleting variant category:", error);
    return { success: false, error: "Failed to delete variant category" };
  }
};

const createVariant = async ({
  variantCategoryId,
  productId,
  restaurantId,
  userId,
  data,
}: {
  variantCategoryId: string;
  productId: string;
  restaurantId: string;
  userId: string;
  data: VariantCreateInput;
}) => {
  try {
    if (!variantCategoryId || !productId || !restaurantId || !userId) {
      return { success: false, error: "All IDs are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const variantCategory = await prisma.variantCategory.findUnique({
      where: { id: variantCategoryId },
    });

    if (!variantCategory || variantCategory.productId !== productId) {
      return { success: false, error: "Variant category not found" };
    }

    const variant = await prisma.variant.create({
      data: {
        variantCategoryId,
        name: data.name,
        priceModifier: data.priceModifier,
      },
    });

    return { success: true, data: variant };
  } catch (error) {
    console.error("Error creating variant:", error);
    return { success: false, error: "Failed to create variant" };
  }
};

const updateVariant = async ({
  id,
  variantCategoryId,
  restaurantId,
  userId,
  data,
}: {
  id: string;
  variantCategoryId: string;
  restaurantId: string;
  userId: string;
  data: VariantUpdateInput;
}) => {
  try {
    if (!id || !variantCategoryId || !restaurantId || !userId) {
      return { success: false, error: "All IDs are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const variant = await prisma.variant.findUnique({
      where: { id },
    });

    if (!variant || variant.variantCategoryId !== variantCategoryId) {
      return { success: false, error: "Variant not found" };
    }

    const updated = await prisma.variant.update({
      where: { id },
      data,
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating variant:", error);
    return { success: false, error: "Failed to update variant" };
  }
};

const deleteVariant = async (id: string, variantCategoryId: string, restaurantId: string, userId: string) => {
  try {
    if (!id || !variantCategoryId || !restaurantId || !userId) {
      return { success: false, error: "All IDs are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const variant = await prisma.variant.findUnique({
      where: { id },
    });

    if (!variant || variant.variantCategoryId !== variantCategoryId) {
      return { success: false, error: "Variant not found" };
    }

    await prisma.variant.delete({
      where: { id },
    });

    return { success: true, message: "Variant deleted successfully" };
  } catch (error) {
    console.error("Error deleting variant:", error);
    return { success: false, error: "Failed to delete variant" };
  }
};

export {
  createVariant,
  createVariantCategory,
  deleteVariant,
  deleteVariantCategory,
  updateVariant,
  updateVariantCategory,
};
