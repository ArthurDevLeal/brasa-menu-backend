import { prisma } from "../lib/prisma";

const getProductMetrics = async (productId: string) => {
  try {
    if (!productId) {
      return { success: false, error: "Product ID is required" };
    }

    const metrics = await prisma.productMetric.findUnique({
      where: { productId },
    });

    if (!metrics) {
      return { success: false, error: "Metrics not found" };
    }

    return { success: true, data: metrics };
  } catch (error) {
    console.error("Error fetching product metrics:", error);
    return { success: false, error: "Failed to fetch metrics" };
  }
};

const getRestaurantMetrics = async (restaurantId: string) => {
  try {
    if (!restaurantId) {
      return { success: false, error: "Restaurant ID is required" };
    }

    const metrics = await prisma.productMetric.findMany({
      where: { restaurantId },
      include: {
        product: true,
      },
      orderBy: { views: "desc" },
    });

    return { success: true, data: metrics };
  } catch (error) {
    console.error("Error fetching restaurant metrics:", error);
    return { success: false, error: "Failed to fetch metrics" };
  }
};

const getTopProductsByViews = async (restaurantId: string, limit: number = 10) => {
  try {
    if (!restaurantId) {
      return { success: false, error: "Restaurant ID is required" };
    }

    const products = await prisma.productMetric.findMany({
      where: { restaurantId },
      include: {
        product: true,
      },
      orderBy: { views: "desc" },
      take: limit,
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching top products by views:", error);
    return { success: false, error: "Failed to fetch products" };
  }
};

const getTopProductsByAddedToCart = async (restaurantId: string, limit: number = 10) => {
  try {
    if (!restaurantId) {
      return { success: false, error: "Restaurant ID is required" };
    }

    const products = await prisma.productMetric.findMany({
      where: { restaurantId },
      include: {
        product: true,
      },
      orderBy: { addedToCart: "desc" },
      take: limit,
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching top products by added to cart:", error);
    return { success: false, error: "Failed to fetch products" };
  }
};

const recordProductView = async (productId: string, restaurantId: string) => {
  try {
    if (!productId || !restaurantId) {
      return { success: false, error: "Product ID and Restaurant ID are required" };
    }

    const metrics = await prisma.productMetric.findUnique({
      where: { productId },
    });

    if (!metrics) {
      return { success: false, error: "Metrics not found" };
    }

    const updated = await prisma.productMetric.update({
      where: { productId },
      data: {
        views: metrics.views + 1,
        lastViewedAt: new Date(),
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error recording product view:", error);
    return { success: false, error: "Failed to record view" };
  }
};

const recordAddedToCart = async (productId: string, restaurantId: string) => {
  try {
    if (!productId || !restaurantId) {
      return { success: false, error: "Product ID and Restaurant ID are required" };
    }

    const metrics = await prisma.productMetric.findUnique({
      where: { productId },
    });

    if (!metrics) {
      return { success: false, error: "Metrics not found" };
    }

    const updated = await prisma.productMetric.update({
      where: { productId },
      data: {
        addedToCart: metrics.addedToCart + 1,
        lastAddedAt: new Date(),
      },
    });

    const conversionRate = metrics.views > 0 ? parseFloat(((updated.addedToCart / updated.views) * 100).toFixed(2)) : 0;

    await prisma.productMetric.update({
      where: { productId },
      data: {
        conversionRate,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error recording added to cart:", error);
    return { success: false, error: "Failed to record add to cart" };
  }
};

const getConversionRate = async (productId: string) => {
  try {
    if (!productId) {
      return { success: false, error: "Product ID is required" };
    }

    const metrics = await prisma.productMetric.findUnique({
      where: { productId },
    });

    if (!metrics) {
      return { success: false, error: "Metrics not found" };
    }

    const conversionRate = metrics.views > 0 ? parseFloat((metrics.addedToCart / metrics.views * 100).toFixed(2)) : 0;

    return { success: true, data: { productId, conversionRate } };
  } catch (error) {
    console.error("Error fetching conversion rate:", error);
    return { success: false, error: "Failed to fetch conversion rate" };
  }
};

const getRestaurantMetricsOverview = async (restaurantId: string, userId: string) => {
  try {
    if (!restaurantId || !userId) {
      return { success: false, error: "Restaurant ID and User ID are required" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    const metrics = await prisma.productMetric.findMany({
      where: { restaurantId },
      include: {
        product: true,
      },
    });

    const totalViews = metrics.reduce((sum, m) => sum + m.views, 0);
    const totalAddedToCart = metrics.reduce((sum, m) => sum + m.addedToCart, 0);
    const averageConversionRate =
      metrics.length > 0 ? parseFloat((metrics.reduce((sum, m) => sum + m.conversionRate, 0) / metrics.length).toFixed(2)) : 0;
    const topProduct = metrics.length > 0 ? metrics.sort((a, b) => b.views - a.views)[0] : null;

    return {
      success: true,
      data: {
        totalViews,
        totalAddedToCart,
        averageConversionRate,
        topProduct,
        totalProducts: metrics.length,
      },
    };
  } catch (error) {
    console.error("Error fetching metrics overview:", error);
    return { success: false, error: "Failed to fetch metrics overview" };
  }
};

export {
  getConversionRate,
  getProductMetrics,
  getRestaurantMetrics,
  getRestaurantMetricsOverview,
  getTopProductsByAddedToCart,
  getTopProductsByViews,
  recordAddedToCart,
  recordProductView,
};