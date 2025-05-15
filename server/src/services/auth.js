import User from "../models/user.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors.js";

// ! USER CONTROLS
export async function loginUser(username, password) {
  const userData = await User.findOne({ username })
    .select("-createdAt -updatedAt -__v")
    .lean();
  const userExists = Boolean(userData);

  if (!userExists) throw new NotFoundError("User does not exist");
  if (userData.password !== password)
    throw new UnauthorizedError("Incorrect Password");

  delete userData.password;

  return userData;
}

// export async function change

// ! CHECK IF THE USER [IS] LOGGED IN
export async function isValidSession(session) {
  if (!session || !session.user_id) return false;

  const userData = await User.findById(session.user_id)
    .select("-password -createdAt -updatedAt -__v")
    .lean();
  if (!userData) {
    session.destroy();
    res.clearCookie("connect.sid");
    return false;
  }

  return userData;
}
