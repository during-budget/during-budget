import express from "express";
const router = express.Router();
import { isAdmin, isLoggedIn } from "src/api/middleware/auth";
import * as budgets from "src/api/controllers/budgets";

router.get("/:_id/validate", isAdmin, budgets.validate);
router.put("/:_id/fix", isAdmin, budgets.fix);

router.post("/basic", isLoggedIn, budgets.createWithBasic);

router.patch("/:_id/categories", isLoggedIn, budgets.updateCategoriesV3);
router.put(
  "/:_id/categories/:categoryId/amountPlanned",
  isLoggedIn,
  budgets.updateCategoryAmountPlanned
);

router.patch("/:_id", isLoggedIn, budgets.updateField);

router.get("/:_id?", isLoggedIn, budgets.find);
router.delete("/:_id", isLoggedIn, budgets.remove);

export default router;
