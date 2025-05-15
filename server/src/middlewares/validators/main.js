import { checkConversation } from "./validation-chat.js";
import {
  createFieldValidator,
  handleValidationErrors,
} from "./validation-rules.js";
import {
  isUserExist,
  isUsernameAvailable,
  isNoActiveSession,
} from "./validation-user.js";

export const validateLogin = [
  isNoActiveSession,
  createFieldValidator(["data.username"], 4, [isUserExist]),
  createFieldValidator(["data.password"], 1),
  handleValidationErrors,
];
export const validateSignUp = [
  isNoActiveSession,

  createFieldValidator(["data.first_name", "data.last_name"], 1),
  createFieldValidator(["data.email"])
    .pop()
    .isEmail()
    .withMessage("Invalid email address"),

  createFieldValidator(["data.username"], 4, [isUsernameAvailable]),
  createFieldValidator(["data.password"], 5),
  handleValidationErrors,
];

export const validateConversation = [
  checkConversation,
  createFieldValidator(["data.content"], 1),
  handleValidationErrors,
];
