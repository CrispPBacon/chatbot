import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import useAuth from "../hooks/useAuth";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
  parseISO,
} from "date-fns";

export default function Sidebar() {
  const navigate = useNavigate();
  const { setAuth, auth, conversationList, setConversationList } = useAuth();

  const handleLogout = () => {
    api
      .delete("/api/logout", { withCredentials: true })
      .then((res) => {
        console.log(res.data.msg);
        setAuth(null);
        navigate("/login", { replace: true });
      })
      .catch((e) => console.log(e?.response?.data?.error || e));
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    conversation_id: string,
    timestamp: string
  ) => {
    e.stopPropagation();

    api
      .delete(`/api/chat/${conversation_id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data, timestamp);
        setConversationList(
          (prev) =>
            prev
              .map((item) => ({
                ...item,
                conversations: item.conversations.filter(
                  (conv) => conv._id !== conversation_id
                ),
              }))
              .filter((item) => item.conversations.length > 0) // Optional: remove empty date groups
        );
        navigate("/");
      })
      .catch((e) => console.log(e?.response?.data?.error || e));
  };

  return (
    <aside className="sidebar light-shadow">
      <div className="conversation-container">
        <div className="conversation-header">
          <button
            className="btn btn-dark"
            onClick={() => {
              navigate("/");
              window.location.reload();
            }}
          >
            + New Chat
          </button>
        </div>
        <div className="conversation-history">
          {conversationList.map((title, index) => (
            <React.Fragment key={index}>
              <ConversationDate date={title.timestamp} />
              {title.conversations.map((conversation) => (
                <ConversationRow
                  key={conversation._id}
                  title={conversation.title}
                  handleClick={() => navigate(`/${conversation._id}`)}
                  handleDelete={handleDelete}
                  conversation_id={conversation._id}
                  timestamp={conversation.updatedAt}
                />
              ))}
            </React.Fragment>
          ))}

          {/* <ConversationDate date="Chats" />
          {conversationList.map((conversation) => (
            <ConversationRow
              key={conversation._id}
              title={conversation.title}
              handleClick={() => navigate(`/${conversation._id}`)}
              handleDelete={handleDelete}
              conversation_id={conversation._id}
              timestamp={conversation.updatedAt}
            />
          ))} */}
        </div>

        {/* <div className="conversation-history">
          <ConversationDate date="Yesterday" />
          <ConversationRow title="Expense Tracker UI Analysis lorem" />
          <ConversationRow title="Run React Code Request" />
          <ConversationRow title="CSS selector issue" />
        </div>
         */}
      </div>
      <div className="sidebar-menu flex-center flex--column">
        <div className="profile-details flex align-center">
          <span className="profile-img flex-center">
            <img
              src={
                auth?.user?.avatar ||
                "https://i.pinimg.com/736x/43/0c/da/430cda44fe6ae6b9b243b5745fc565e6.jpg"
              }
              alt="profile"
            />
          </span>
          <h6>Hi, {auth?.user.username}</h6>
        </div>
        <button onClick={handleLogout} className="btn btn-dark">
          Logout
        </button>
      </div>
    </aside>
  );
}

interface ConversationRowProps {
  title: string;
  timestamp: string;
  handleClick: () => void;
  handleDelete: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    conversation_id: string,
    timestamp: string
  ) => void;
  conversation_id: string;
}
function ConversationRow({
  title,
  timestamp,
  handleClick,
  handleDelete,
  conversation_id,
}: ConversationRowProps) {
  const { id } = useParams();

  return (
    <div
      className={
        id === conversation_id ? "conversation-row active" : "conversation-row"
      }
      onClick={handleClick}
    >
      {title}
      <span
        className="conversation-row-delete"
        style={{
          position: "absolute",
          padding: ".8rem",
          top: 0,
          right: 0,
          cursor: "pointer",
        }}
        onClick={(e) => handleDelete(e, conversation_id, timestamp)}
      >
        <span className="delete-icon">
          <DeleteIcon />
        </span>
        <span className="delete-icon-2">
          <DeleteForeverIcon />
        </span>
      </span>
    </div>
  );
}

interface ConversationDateProps {
  date: string;
}
function ConversationDate({ date }: ConversationDateProps) {
  const convertDate = (d: string) => {
    const parsedDate = parseISO(d);

    let displayDate: string;

    if (isToday(parsedDate)) {
      displayDate = "Today";
    } else if (isYesterday(parsedDate)) {
      displayDate = "Yesterday";
    } else if (isThisWeek(parsedDate, { weekStartsOn: 1 })) {
      // Returns weekday name, e.g., "Monday"
      displayDate = format(parsedDate, "EEEE");
    } else if (isThisYear(parsedDate)) {
      // Returns "June 2"
      displayDate = format(parsedDate, "MMMM d");
    } else {
      // Returns "June 2, 2024"
      displayDate = format(parsedDate, "MMMM d, yyyy");
    }
    return displayDate;
  };

  return (
    <div className="conversation-row-date">
      <p>{convertDate(date)}</p>
    </div>
  );
}
