import { Router } from "express";
import Users from "./users";
import Products from "./products/products";
import Ai from "./ai/ai.controller";

const router = Router();

router.use("/users", Users);
router.use("/products", Products);
router.use("/ai", Ai);

export default router;
