import { Router } from "express";
import { createUrlController, deleteUrlController, getUrlDetailsController, getUserUrlsDetailsController, updateUrlController } from "../controllers/url.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

const router = Router();

router.route('/')
    .post(optionalAuth, createUrlController)
    .get(isAuthenticated, getUserUrlsDetailsController)

router.route('/:shortUrl')
    .delete(isAuthenticated, deleteUrlController)
    .post(isAuthenticated, updateUrlController)
    .get(isAuthenticated, getUrlDetailsController)

export default router;