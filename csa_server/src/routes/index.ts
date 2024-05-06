import { Router } from "express";
import Users from "./users";
import Cars from "./cars";
import userRequireMiddleware from "../middleware/userRequire";


const router = Router();

router.use(userRequireMiddleware);

router.use("/cars", Cars);
router.use("/users", Users);

export default router;
