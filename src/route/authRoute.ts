import express from "express";
import { userRegistaration } from "../controllers/authController";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Hotel Management System API!");
});

router.post("/register", userRegistaration);

export default router;
