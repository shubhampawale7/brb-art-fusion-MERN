import express from "express";
const router = express.Router();
import {
  getArticles,
  getArticleBySlug,
} from "../controllers/articleController.js";

router.route("/").get(getArticles);
router.route("/:slug").get(getArticleBySlug);

export default router;
