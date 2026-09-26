import express from "express";
import {
  deleteUser,
  getUser,
  login,
  signup,
  updateUser,
} from "../controller/user.controller.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.patch("/:id", updateUser);
router.delete("/", deleteUser);
router.get("/", getUser);
export default router;
