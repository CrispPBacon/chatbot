import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function Sidebar() {
  const navigate = useNavigate();
  const { setAuth, auth, conversationList, setConversationList } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    if (id) console.log(id);
  }, [id]);

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
    conversation_id: string
  ) => {
    e.stopPropagation();
    api
      .delete(`/api/chat/${conversation_id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setConversationList((prev) => {
          return prev.filter((item) => item._id !== conversation_id);
        });
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
          <ConversationDate date="Chats" />
          {conversationList.map((conversation) => (
            <ConversationRow
              key={conversation._id}
              title={conversation.title}
              handleClick={() => navigate(`/${conversation._id}`)}
              handleDelete={handleDelete}
              conversation_id={conversation._id}
            />
          ))}
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
  handleClick: () => void;
  handleDelete: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    conversation_id: string
  ) => void;
  conversation_id: string;
}
function ConversationRow({
  title,
  handleClick,
  handleDelete,
  conversation_id,
}: ConversationRowProps) {
  return (
    <div className="conversation-row" onClick={handleClick}>
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
        onClick={(e) => handleDelete(e, conversation_id)}
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
  return (
    <div className="conversation-row-date">
      <p>{date}</p>
    </div>
  );
}
