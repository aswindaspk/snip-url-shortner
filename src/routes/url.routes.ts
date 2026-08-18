import { Router } from "express";
import { createUrlController } from "../controllers/url.controller.js";

const router = Router();

router.post('/', createUrlController);

export default router;