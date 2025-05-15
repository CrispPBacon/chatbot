import { isValidMongoId } from "../../utils/general-utils.js";
import Conversation from "../../models/conversation.js";
import { NotFoundError } from "../../utils/errors.js";

export async function checkConversation(req, _, next) {
  const _id = req.params.id;
  const user_id = req.session?.user_id;
  if (!isValidMongoId(_id))
    return next(new NotFoundError("Invalid Conversation ID"));

  const isConversationExist = await Conversation.findOne({
    user_id,
    _id,
  });

  if (!isConversationExist)
    return next(new NotFoundError("Conversation does not exist"));
  next();
}
