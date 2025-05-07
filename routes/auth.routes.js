import express from "express";
import { signup, signin } from "../controllers/auth.controller.js";
import verifySignUp from "../middleware/verifySignUp.js";

const router = express.Router();

router.post("/signup", [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], signup);
router.post("/signin", signin);

export default router;
