import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import User from "../models/user.js";

export async function getStatistics() {
  // Step 1: Get all users (without sensitive fields)
  const users = await User.find({})
    .select("-password -createdAt -updatedAt -__v")
    .lean();

  const userIds = users.map((user) => user._id);

  // Step 2: Get prompts count grouped by user
  const messageCounts = await Message.aggregate([
    { $match: { user_id: { $in: userIds } } },
    { $group: { _id: "$user_id", promptsCount: { $sum: 1 } } },
  ]);

  // Step 3: Get conversations count grouped by user
  const conversationCounts = await Conversation.aggregate([
    { $match: { user_id: { $in: userIds } } },
    { $group: { _id: "$user_id", conversationsCount: { $sum: 1 } } },
  ]);

  // Step 4: Convert counts to maps for quick lookup
  const messageMap = new Map(
    messageCounts.map((item) => [item._id.toString(), item.promptsCount])
  );
  const conversationMap = new Map(
    conversationCounts.map((item) => [
      item._id.toString(),
      item.conversationsCount,
    ])
  );

  // Step 5: Enrich users
  const enrichedUsers = users.map((user) => ({
    ...user,
    promptsCount: messageMap.get(user._id.toString()) || 0,
    conversationsCount: conversationMap.get(user._id.toString()) || 0,
  }));

  // Step 6: Global statistics (using .countDocuments() for better performance)
  const [usersCount, messagesCount, conversationsCount] = await Promise.all([
    User.countDocuments(),
    Message.countDocuments(),
    Conversation.countDocuments(),
  ]);

  return {
    users: enrichedUsers,
    usersCount,
    messagesCount,
    conversationsCount,
  };
}
