import express from "express";
import { chatWithAI } from "../Contollers/chatController.js";

const router = express.Router();

router.post("/chat", chatWithAI);

export default router;
