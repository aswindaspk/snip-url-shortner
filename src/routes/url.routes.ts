import { Router } from "express";
import { createUrlController, deleteUrlController } from "../controllers/url.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/')
    .post(createUrlController)

router.route('/:userId/:shortUrl')
    .delete(isAuthenticated, deleteUrlController)

export default router;