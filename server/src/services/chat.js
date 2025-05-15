import openai from "../config/openai.js";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { NotFoundError } from "../utils/errors.js";

export async function generateTitle(content) {
  const titlePrompt = [
    {
      role: "system",
      content:
        "You are a helpful assistant that summarizes conversations into short, clear titles. Limit the title to 3–5 words.",
    },
    {
      role: "user",
      content: "Give this conversation a short and descriptive title.",
    },
    {
      role: "user",
      content,
    },
  ];

  return await getChatCompletion(titlePrompt);
}

export async function createNewChat(user_id, content) {
  const initialPrompt = [
    {
      role: "system",
      content:
        "You are a helpful assistant that summarizes conversations. Limit it to maximum of 10 sentences.",
    },
    { role: "user", content },
  ];

  // ! [GENERATE] TITLE AND FIRST RESPONSE ! //
  const title = await generateTitle(content);
  const response = await getChatCompletion(initialPrompt);

  // ! [CREATE] NEW CONVERSATION AND SAVE THE FIRST CONVERSATION ! //
  const conversation_data = await new Conversation({ user_id, title }).save();
  const message_data = await newMessage(
    user_id,
    "user",
    content,
    conversation_data._id
  );
  const ai_message_data = await newMessage(
    user_id,
    "assistant",
    response,
    conversation_data._id
  );

  // console.log(message_data, ai_message_data);

  return conversation_data;
}

export async function getChatCompletion(messages, model = "gpt-4o-mini") {
  const completion = await openai.chat.completions.create({
    model,
    messages,
    store: true,
  });

  return completion.choices[0].message.content;
}

export async function newMessage(user_id, role, content, conversation_id) {
  const data = await new Message({
    user_id,
    role,
    content,
    conversation_id,
  }).save();
  return data;
}

export async function getMessages(user_id, conversation_id) {
  const query = {
    user_id,
    conversation_id,
  };
  const messages = await Message.find(query);

  if (!messages.length) throw new NotFoundError("Conversation does not exists");

  return messages;
}

export async function sendPromptRequest(user_id, conversation_id, content) {
  const response = await getChatCompletion([
    {
      role: "system",
      content:
        "You are a helpful assistant that summarizes conversations. Limit it to maximum of 10 sentences.",
    },
    {
      role: "user",
      content,
    },
  ]);

  await newMessage(user_id, "user", content, conversation_id);
  const assistant_message = await newMessage(
    user_id,
    "assistant",
    response,
    conversation_id
  );

  return [assistant_message];
}

export async function getConversations(user_id) {
  const Conversations = await Conversation.find({ user_id });
  return Conversations;
}
