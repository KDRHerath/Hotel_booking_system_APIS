import express from "express";
import {
  reSendVerificationCode,
  userRegistaration,
  verifyUser,
} from "../controllers/authController";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Hotel Management System API!");
});

router.post("/register", userRegistaration);
router.put("/resend", reSendVerificationCode);
router.put("/verify", verifyUser);

export default router;
