import express from "express";
import { UsersController } from "../controllers/users.controller";
import { authenticate, isAdmin } from "../../../middleware/authorize-user";

const router = express();

router.get("/", authenticate, isAdmin, UsersController.getUsers);
router.get("/admin", authenticate, isAdmin, UsersController.getAdmins);

export const UsersRoutes = router;
