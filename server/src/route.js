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
  deleteConversation,
  fetchStatistics,
  sendForgotPasswordMail,
  forgotPassword,
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

router.route("/api/ping").get((req, res) => {
  return res.status(200).json({ msg: "OK" });
});
router.route("/api/forgot-password").post(sendForgotPasswordMail);
router.route("/api/reset-password/:token").post(forgotPassword);

// ? [PRIVATE] ROUTES
router.use(verifyAuth);

// ? [AUTH] RELATED ROUTES
router.route("/api/chat").post(newConversation).get(fetchConversations);
router
  .route("/api/chat/:id")
  .post(validateConversation, sendPrompt)
  .get(checkConversation, fetchMessages)
  .delete(checkConversation, deleteConversation);

router.route("/api/logout").delete(logout);

// ! [ADMIN] ROUTES
router.route("/api/admin/statistics").get(fetchStatistics);

export default router;
