import { Router } from "express";
import { createUrlController } from "../controllers/url.controller.js";

const router = Router();

router.route('/')
    .post(createUrlController)

router.route('/:')
    .get()

export default router;