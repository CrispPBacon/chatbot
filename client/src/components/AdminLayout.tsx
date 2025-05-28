import ContactsIcon from "@mui/icons-material/Contacts";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";

import chroma from "chroma-js";
import { useEffect, useState } from "react";
import api from "../api/api";
const textColor = chroma("#7cc2e7").darken(3).hex(); // darker for contrast
const textColorTwo = chroma("#7acb94").darken(3).hex(); // darker for contrast
const textColorThree = chroma("wheat").darken(3).hex(); // darker for contrast

interface usersProps {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  avatar: string | null;
  conversationsCount: number;
  promptsCount: number;
}

export default function AdminLayout() {
  const [usersCount, setUsersCount] = useState(0);
  const [conversationsCount, setConversationsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [usersList, setUsersList] = useState<usersProps[]>([]);

  useEffect(() => {
    api
      .get("/api/admin/statistics", { withCredentials: true })
      .then((res) => {
        console.log(res.data.users);
        setUsersList(res.data?.users);
        setUsersCount(res.data?.usersCount || 0);
        setConversationsCount(res.data?.conversationsCount || 0);
        setMessagesCount(res.data?.messagesCount || 0);
      })
      .catch((e) => console.log(e?.response?.data?.error || e));
  }, []);

  return (
    <>
      <aside className="aside"></aside>
      <main className="main">
        <div className="admin-container">
          <h1>Dashboard</h1>
          <div className="dashboard-statistics-container">
            <div
              className="statistic-item flex align-center"
              style={{ background: "#7cc2e7" }}
            >
              <div className="details">
                <h2 style={{ color: textColor }}>{usersCount}</h2>
                <h4 style={{ color: textColor }}>Users</h4>
              </div>
              <ContactsIcon style={{ fontSize: "3rem", color: textColor }} />
            </div>
            <div
              className="statistic-item flex align-center"
              style={{ background: "#7acb94" }}
            >
              {" "}
              <div className="details">
                <h2 style={{ color: textColorTwo }}>{conversationsCount}</h2>
                <h4 style={{ color: textColorTwo }}>Conversations</h4>
              </div>
              <QuestionAnswerIcon
                style={{ fontSize: "3rem", color: textColorTwo }}
              />
            </div>
            <div
              className="statistic-item flex align-center"
              style={{ background: "wheat" }}
            >
              {" "}
              <div className="details">
                <h2 style={{ color: textColorThree }}>{messagesCount}</h2>
                <h4 style={{ color: textColorThree }}>Messages</h4>
              </div>
              <LocalPostOfficeIcon
                style={{ fontSize: "3rem", color: textColorThree }}
              />
            </div>
          </div>
          <div className="dashboard-users-container">
            <h2>Users</h2>
            <div className="dashboard-users-grid">
              <div className="users-grid-row users-grid-header">
                <div className="users-grid-item flex align-center">Profile</div>
                <div className="users-grid-item flex align-center">Prompts</div>
                <div className="users-grid-item flex align-center">
                  Conversations
                </div>
              </div>
              {/* END */}
              {usersList.map((user, index) => (
                <UsersRow
                  key={index}
                  avatar={
                    user?.avatar ||
                    "https://i.pinimg.com/736x/43/0c/da/430cda44fe6ae6b9b243b5745fc565e6.jpg"
                  }
                  promptsCount={user.promptsCount}
                  conversationsCount={user.conversationsCount}
                  username={user.username}
                />
              ))}
              {/* <UsersRow /> */}
              {/* <UsersRow />
              <UsersRow />
              <UsersRow />
              <UsersRow />
              <UsersRow />
              <UsersRow />
              <UsersRow /> */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

interface UsersRowType {
  avatar: string;
  username: string;
  promptsCount: number;
  conversationsCount: number;
}
function UsersRow({
  username,
  promptsCount,
  conversationsCount,
  avatar,
}: UsersRowType) {
  return (
    <div className="users-grid-row">
      <div className="users-grid-item flex align-center">
        <span className="profile-img">
          <img src={avatar} alt="profile" />
        </span>
        <strong>{username}</strong>
      </div>
      <div className="users-grid-item flex align-center">
        <h6>{promptsCount}</h6>
      </div>
      <div className="users-grid-item flex align-center">
        <h6>{conversationsCount}</h6>
      </div>
    </div>
  );
}
