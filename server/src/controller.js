import User from "./models/user.js";
import { isValidSession, loginUser } from "./services/auth.js";
import {
  createNewChat,
  getConversations,
  getMessages,
  sendPromptRequest,
} from "./services/chat.js";
import { UnauthorizedError } from "./utils/errors.js";
// ! AUTH CONTROLLER ! //

/* POST http://localhost:3000/api/user 

  User Data E.G:
  {
    "data": {
        "first_name": "Jair Jane",
        "last_name": "Cruz",
        "email": "123email@mail.com",
        "username": "jaijai",
        "password": "123123"
    }
  }
*/
export async function createUser(req, res, next) {
  try {
    const user = req.body.data;
    const data = await new User(user).save();
    return res.status(201).json(data);
  } catch (e) {
    next(e);
  }
}

/* POST http://localhost:3000/api/login 
  {
    "data": {
        "username": "jaijai",
        "password": "123123"
    }
  }
*/
export async function login(req, res, next) {
  try {
    const { username, password } = req.body.data || {};
    const user = await loginUser(username, password);
    req.session.user_id = user._id;

    return res.status(200).json(user);
  } catch (e) {
    next(e);
  }
}

/* GET http://localhost:3000/api/login */
export async function refreshAuth(req, res, next) {
  try {
    const user = await isValidSession(req.session);
    if (!user) {
      req.session.destroy();
      res.clearCookie("connect.sid");
      throw new UnauthorizedError("Session invalid or does not exist");
    }

    return res.status(200).json(user);
  } catch (e) {
    next(e);
  }
}

/* DELETE http://localhost:3000/api/logout */
export async function logout(req, res, next) {
  try {
    req.session.destroy();
    res.clearCookie("connect.sid");
    return res.status(200).json({ msg: "You have logged out" });
  } catch (e) {
    next(e);
  }
}

/* POST http://localhost:3000/api/chat
    {
      "data": {
        "content": "Hey how are you?"
      }
    }
 */
export async function newConversation(req, res, next) {
  try {
    const { content } = req.body.data || {};
    const user_id = req.session?.user_id;
    const data = await createNewChat(user_id, content);
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
}

/* POST http://localhost:3000/api/chat/:id
    {
      "data": {
        "content": "Hey how are you?"
      }
    }
*/
export async function sendPrompt(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.session?.user_id;
    const { content } = req.body.data || {};
    const response = await sendPromptRequest(user_id, id, content);

    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
}

/* GET http://localhost:3000/api/chat/:id */
export async function fetchMessages(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.session?.user_id;
    const messages = await getMessages(user_id, id);

    return res.status(200).json(messages.reverse());
  } catch (e) {
    next(e);
  }
}

/* GET http://localhost:3000/api/chat*/
export async function fetchConversations(req, res, next) {
  try {
    const user_id = req.session?.user_id;
    const data = await getConversations(user_id);
    return res.status(200).json(data.reverse());
  } catch (e) {
    next(e);
  }
}
