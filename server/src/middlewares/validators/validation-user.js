import User from "../../models/user.js";
import { isValidSession } from "../../services/auth.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/errors.js";

export async function isUsernameAvailable(username) {
  const usernameTaken = Boolean(await User.findOne({ username }));
  if (usernameTaken) throw new UnauthorizedError("Username is already taken");
  return true;
}

export async function isUserExist(username) {
  const userExist = Boolean(await User.findOne({ username }));
  if (!userExist) throw new NotFoundError("User does not exist");
  return true;
}

// ! CHECK IF THE USER [IS NOT] LOGGED IN
export async function isNoActiveSession(req, res, next) {
  const IsValid = await isValidSession(req.session);
  if (IsValid) return next(new ConflictError("Active session already exists"));

  res.clearCookie("connect.sid");
  return next();
}
