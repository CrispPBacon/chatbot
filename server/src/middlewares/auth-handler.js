import { isValidSession } from "../services/auth.js";
import { UnauthorizedError } from "../utils/errors.js";

// ! VERIFY AUTH FOR [PROTECTED] REQUESTS
export async function verifyAuth(req, res, next) {
  try {
    const IsValid = await isValidSession(req.session);
    if (!IsValid) {
      res.clearCookie("connect.sid");
      throw new UnauthorizedError("Session is invalid or expired");
    }
    next();
  } catch (error) {
    next(error);
  }
}
