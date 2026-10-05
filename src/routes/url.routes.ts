import { Router } from "express";
import { createUrlController, deleteUrlController, getUrlDetailsController, updateUrlController } from "../controllers/url.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/')
    .post(createUrlController)

router.route('/:shortUrl')
    .delete(isAuthenticated, deleteUrlController)
    .post(isAuthenticated, updateUrlController)
    .get(isAuthenticated, getUrlDetailsController)

export default router;