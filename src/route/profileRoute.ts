import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { getUser } from "../controllers/profileController";

const router = express.Router();

router.get("/", isAuthenticated, getUser);

export default router;
