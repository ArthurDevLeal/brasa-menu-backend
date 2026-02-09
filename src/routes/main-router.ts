import { Router } from "express";
import { AddOnController } from "../controllers/add-on-controller";
import { authController } from "../controllers/auth-controller";
import { CategoryController } from "../controllers/category-controller";
import { MetricController } from "../controllers/metrics-controller";
import { ProductController } from "../controllers/product-controller";
import { RestaurantController } from "../controllers/restaurant-controller";
import { RestaurantSettingsController } from "../controllers/restaurant-settings-controller";
import { userController } from "../controllers/user-controller";
import { VariantController } from "../controllers/variant-controller";
import { AuthMiddleware } from "../middleware/auth";

const mainRouter = Router();

const authMainController = new authController();
const userMainController = new userController();
const restaurantController = new RestaurantController();
const settingsController = new RestaurantSettingsController();
const categoryController = new CategoryController();
const productController = new ProductController();
const variantController = new VariantController();
const addOnController = new AddOnController();
const metricController = new MetricController();

// Auth Routes
mainRouter.post("/auth/login", authMainController.authenticate);
mainRouter.post("/auth/register", userMainController.store);

mainRouter.get("/user/profile", AuthMiddleware, userMainController.index);
mainRouter.put("/user", AuthMiddleware, userMainController.update);
mainRouter.delete("/user", AuthMiddleware, userMainController.delete);

mainRouter.get("/restaurants/:id", restaurantController.show);
mainRouter.get("/restaurants/slug/:slug", restaurantController.showBySlug);

// Restaurant Routes - Admin
mainRouter.post("/restaurants", AuthMiddleware, restaurantController.store);
mainRouter.get("/restaurants", AuthMiddleware, restaurantController.index);
mainRouter.patch("/restaurants/:id", AuthMiddleware, restaurantController.update);
mainRouter.delete("/restaurants/:id", AuthMiddleware, restaurantController.delete);
mainRouter.patch("/restaurants/:id/toggle-status", AuthMiddleware, restaurantController.toggleStatus);

// Settings Routes - Public
mainRouter.get("/restaurants/:restaurantId/settings", settingsController.show);

// Settings Routes - Admin
mainRouter.patch("/restaurants/:restaurantId/settings", AuthMiddleware, settingsController.update);

// Opening Hours Routes - Public
mainRouter.get("/restaurants/:restaurantId/opening-hours", settingsController.show);

// Opening Hours Routes - Admin
mainRouter.post(
  "/restaurants/:restaurantId/opening-hours",
  AuthMiddleware,
  settingsController.createOpeningHour,
);
mainRouter.put(
  "/restaurants/:restaurantId/settings/:settingsId/opening-hours/:dayOfWeek",
  AuthMiddleware,
  settingsController.updateOpeningHour,
);
mainRouter.delete(
  "/restaurants/:restaurantId/settings/:settingsId/opening-hours/:dayOfWeek",
  AuthMiddleware,
  settingsController.deleteOpeningHour,
);
mainRouter.patch(
  "/restaurants/:restaurantId/settings/:settingsId/opening-hours/:dayOfWeek/toggle",
  AuthMiddleware,
  settingsController.toggleOpeningHour,
);

// Category Routes - Public
mainRouter.get("/restaurants/:restaurantId/categories", categoryController.index);
mainRouter.get("/categories/:id", categoryController.show);
mainRouter.get(
  "/restaurants/:restaurantId/categories/with-product-count",
  categoryController.indexWithProductCount,
);

// Category Routes - Admin
mainRouter.post("/restaurants/:restaurantId/categories", AuthMiddleware, categoryController.store);
mainRouter.put("/restaurants/:restaurantId/categories/:id", AuthMiddleware, categoryController.update);
mainRouter.delete("/restaurants/:restaurantId/categories/:id", AuthMiddleware, categoryController.delete);
mainRouter.patch(
  "/restaurants/:restaurantId/categories/:id/toggle-status",
  AuthMiddleware,
  categoryController.toggleStatus,
);

// Product Routes - Public
mainRouter.get("/products/:id", productController.show);
mainRouter.get("/categories/:categoryId/products", productController.indexByCategory);
mainRouter.get("/restaurants/:restaurantId/products", productController.indexByRestaurant);

// Product Routes - Admin
mainRouter.post(
  "/restaurants/:restaurantId/categories/:categoryId/products",
  AuthMiddleware,
  productController.store,
);
mainRouter.patch("/restaurants/:restaurantId/products/:id", AuthMiddleware, productController.update);
mainRouter.delete("/restaurants/:restaurantId/products/:id", AuthMiddleware, productController.delete);
mainRouter.patch(
  "/restaurants/:restaurantId/products/:id/toggle-status",
  AuthMiddleware,
  productController.toggleStatus,
);

// Variant Category Routes - Admin
mainRouter.post(
  "/restaurants/:restaurantId/products/:productId/variant-categories",
  AuthMiddleware,
  variantController.storeCategory,
);
mainRouter.put(
  "/restaurants/:restaurantId/products/:productId/variant-categories/:id",
  AuthMiddleware,
  variantController.updateCategory,
);
mainRouter.delete(
  "/restaurants/:restaurantId/products/:productId/variant-categories/:id",
  AuthMiddleware,
  variantController.deleteCategory,
);

// Variant Routes - Admin
mainRouter.post(
  "/restaurants/:restaurantId/products/:productId/variant-categories/:variantCategoryId/variants",
  AuthMiddleware,
  variantController.store,
);
mainRouter.put(
  "/restaurants/:restaurantId/products/:productId/variant-categories/:variantCategoryId/variants/:id",
  AuthMiddleware,
  variantController.update,
);
mainRouter.delete(
  "/restaurants/:restaurantId/variant-categories/:variantCategoryId/variants/:id",
  AuthMiddleware,
  variantController.delete,
);

// AddOn Category Routes - Admin
mainRouter.post(
  "/restaurants/:restaurantId/products/:productId/addon-categories",
  AuthMiddleware,
  addOnController.storeCategory,
);
mainRouter.put(
  "/restaurants/:restaurantId/products/:productId/addon-categories/:id",
  AuthMiddleware,
  addOnController.updateCategory,
);
mainRouter.delete(
  "/restaurants/:restaurantId/products/:productId/addon-categories/:id",
  AuthMiddleware,
  addOnController.deleteCategory,
);

// AddOn Routes - Admin
mainRouter.post(
  "/restaurants/:restaurantId/products/:productId/addon-categories/:addOnCategoryId/addons",
  AuthMiddleware,
  addOnController.store,
);
mainRouter.put(
  "/restaurants/:restaurantId/addon-categories/:addOnCategoryId/addons/:id",
  AuthMiddleware,
  addOnController.update,
);
mainRouter.delete(
  "/restaurants/:restaurantId/addon-categories/:addOnCategoryId/addons/:id",
  AuthMiddleware,
  addOnController.delete,
);

// Metrics Routes - Public
mainRouter.post("/products/:productId/restaurants/:restaurantId/record-view", metricController.recordView);
mainRouter.post(
  "/products/:productId/restaurants/:restaurantId/record-add-to-cart",
  metricController.recordAddToCart,
);
mainRouter.get("/products/:productId/metrics", metricController.showProductMetrics);
mainRouter.get("/products/:productId/conversion-rate", metricController.showConversionRate);

// Metrics Routes - Admin
mainRouter.get("/restaurants/:restaurantId/metrics", AuthMiddleware, metricController.showRestaurantMetrics);
mainRouter.get(
  "/restaurants/:restaurantId/metrics/top-by-views",
  AuthMiddleware,
  metricController.topProductsByViews,
);
mainRouter.get(
  "/restaurants/:restaurantId/metrics/top-by-added-to-cart",
  AuthMiddleware,
  metricController.topProductsByAddedToCart,
);
mainRouter.get("/restaurants/:restaurantId/metrics/overview", AuthMiddleware, metricController.overview);

export { mainRouter };
