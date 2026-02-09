import {
  AddOnCategoryCreateInput,
  AddOnCategoryUpdateInput,
  AddOnCreateInput,
  AddOnUpdateInput,
} from "../../generated/prisma/models";
import { prisma } from "../lib/prisma";
const createAddOnCategory = async ({
  productId,
  restaurantId,
  userId,
  data,
}: {
  productId: string;
  restaurantId: string;
  userId: string;
  data: AddOnCategoryCreateInput;
}) => {
  try {
    if (!productId || !restaurantId || !userId) {
      return { success: false, error: "Product ID, Restaurant ID and User ID are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.restaurantId !== restaurantId) {
      return { success: false, error: "Product not found" };
    }

    const addOnCategory = await prisma.addOnCategory.create({
      data: {
        productId,
        name: data.name,
        orderIndex: data.orderIndex || 0,
        maxSelections: data.maxSelections || 0,
        minSelections: data.minSelections || 0,
        isRequired: data.isRequired || false,
      },
      include: {
        addOns: true,
      },
    });

    return { success: true, data: addOnCategory };
  } catch (error) {
    console.error("Error creating addon category:", error);
    return { success: false, error: "Failed to create addon category" };
  }
};

const updateAddOnCategory = async ({
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
  data: AddOnCategoryUpdateInput;
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

    const addOnCategory = await prisma.addOnCategory.findUnique({
      where: { id },
    });

    if (!addOnCategory || addOnCategory.productId !== productId) {
      return { success: false, error: "Addon category not found" };
    }

    const updated = await prisma.addOnCategory.update({
      where: { id },
      data,
      include: {
        addOns: true,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating addon category:", error);
    return { success: false, error: "Failed to update addon category" };
  }
};

const deleteAddOnCategory = async (id: string, productId: string, restaurantId: string, userId: string) => {
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

    const addOnCategory = await prisma.addOnCategory.findUnique({
      where: { id },
    });

    if (!addOnCategory || addOnCategory.productId !== productId) {
      return { success: false, error: "Addon category not found" };
    }

    await prisma.addOnCategory.delete({
      where: { id },
    });

    return { success: true, message: "Addon category deleted successfully" };
  } catch (error) {
    console.error("Error deleting addon category:", error);
    return { success: false, error: "Failed to delete addon category" };
  }
};

const createAddOn = async ({
  addOnCategoryId,
  productId,
  restaurantId,
  userId,
  data,
}: {
  addOnCategoryId: string;
  productId: string;
  restaurantId: string;
  userId: string;
  data: AddOnCreateInput;
}) => {
  try {
    if (!addOnCategoryId || !productId || !restaurantId || !userId) {
      return { success: false, error: "All IDs are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const addOnCategory = await prisma.addOnCategory.findUnique({
      where: { id: addOnCategoryId },
    });

    if (!addOnCategory || addOnCategory.productId !== productId) {
      return { success: false, error: "Addon category not found" };
    }

    const addOn = await prisma.addOn.create({
      data: {
        addOnCategoryId,
        name: data.name,
        price: data.price,
      },
    });

    return { success: true, data: addOn };
  } catch (error) {
    console.error("Error creating addon:", error);
    return { success: false, error: "Failed to create addon" };
  }
};

const updateAddOn = async ({
  id,
  addOnCategoryId,
  restaurantId,
  userId,
  data,
}: {
  id: string;
  addOnCategoryId: string;
  restaurantId: string;
  userId: string;
  data: AddOnUpdateInput;
}) => {
  try {
    if (!id || !addOnCategoryId || !restaurantId || !userId) {
      return { success: false, error: "All IDs are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const addOn = await prisma.addOn.findUnique({
      where: { id },
    });

    if (!addOn || addOn.addOnCategoryId !== addOnCategoryId) {
      return { success: false, error: "Addon not found" };
    }

    const updated = await prisma.addOn.update({
      where: { id },
      data,
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating addon:", error);
    return { success: false, error: "Failed to update addon" };
  }
};

const deleteAddOn = async (id: string, addOnCategoryId: string, restaurantId: string, userId: string) => {
  try {
    if (!id || !addOnCategoryId || !restaurantId || !userId) {
      return { success: false, error: "All IDs are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const addOn = await prisma.addOn.findUnique({
      where: { id },
    });

    if (!addOn || addOn.addOnCategoryId !== addOnCategoryId) {
      return { success: false, error: "Addon not found" };
    }

    await prisma.addOn.delete({
      where: { id },
    });

    return { success: true, message: "Addon deleted successfully" };
  } catch (error) {
    console.error("Error deleting addon:", error);
    return { success: false, error: "Failed to delete addon" };
  }
};

export {
  createAddOn,
  createAddOnCategory,
  deleteAddOn,
  deleteAddOnCategory,
  updateAddOn,
  updateAddOnCategory,
};
