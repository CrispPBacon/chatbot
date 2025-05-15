import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const { setAuth, auth, conversationList } = useAuth();

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
}
function ConversationRow({ title, handleClick }: ConversationRowProps) {
  return (
    <div className="conversation-row" onClick={handleClick}>
      {title}
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
