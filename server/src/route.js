import express from "express";
import {
  login,
  logout,
  createUser,
  refreshAuth,
  newConversation,
  sendPrompt,
  fetchMessages,
  fetchConversations,
} from "./controller.js";
import {
  validateConversation,
  validateLogin,
  validateSignUp,
} from "./middlewares/validators/main.js";
import { verifyAuth } from "./middlewares/auth-handler.js";
import { checkConversation } from "./middlewares/validators/validation-chat.js";

const router = express.Router();

// ? [PUBLIC] ROUTES
router.route("/api/login").post(validateLogin, login).get(refreshAuth);
router.route("/api/user").post(validateSignUp, createUser);

// ? [PRIVATE] ROUTES
router.use(verifyAuth);

// ! [AUTH] RELATED ROUTES
router.route("/api/chat").post(newConversation).get(fetchConversations);
router
  .route("/api/chat/:id")
  .post(validateConversation, sendPrompt)
  .get(checkConversation, fetchMessages);

router.route("/api/logout").delete(logout);

export default router;
