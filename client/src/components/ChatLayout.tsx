import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import useAuth from "../hooks/useAuth";

import ReactMarkdown from "react-markdown";
import "github-markdown-css/github-markdown.css";

interface messagesProps {
  user_id: string | undefined;
  conversation_id: string;
  role: string;
  content: string;
}

export default function ChatLayout() {
  const [msgContent, setMsgContent] = useState("");
  const [messages, setMessages] = useState<messagesProps[]>([]);
  const [showLoader, setShowLoader] = useState(false);

  const { auth, setConversationList } = useAuth();
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/chat/${id}`, { withCredentials: true })
      .then((res) => setMessages(res.data))
      .catch((e) => {
        navigate("/", { replace: true });
        console.log(e?.response?.data?.error || e);
      });
  }, [id, navigate]);

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!msgContent.trim()) return;
    if (e.key == "Enter" && !showLoader) {
      setMsgContent("");
      setShowLoader(true);
      onHandleSubmit();
    }
  };

  const onHandleSubmit = () => {
    const data = { content: msgContent };
    if (id) {
      const user_message = {
        content: msgContent,
        role: "user",
        conversation_id: id,
        user_id: auth?.user._id,
      };
      const data = { messages: [user_message, ...messages] };
      setMessages((prev) => [user_message, ...prev]);
      api
        .post(`/api/chat/${id}`, { data }, { withCredentials: true })
        .then((res) => {
          setMessages((prev) => [...res.data, ...prev]);
          setShowLoader(false);
        })
        .catch((e) => {
          console.log(e?.response?.data?.error || e);
          setShowLoader(false);
        });
    } else {
      api
        .post("/api/chat", { data }, { withCredentials: true })
        .then((res) => {
          navigate(res.data._id, { replace: true });
          setShowLoader(false);
          api
            .get("/api/chat", { withCredentials: true })
            .then((res) => {
              setConversationList(res.data);
            })
            .catch((e) => console.log(e?.response?.data?.error || e));
        })
        .catch((e) => {
          console.log(e?.response?.data?.error || e);
          setShowLoader(false);
        });
    }
  };

  return (
    <main className="main light-shadow">
      <div className="message-container">
        {showLoader ? <div className="loader" /> : null}
        {messages.map((message, index) => (
          <MessageRow
            key={index}
            content={message.content}
            isUser={message.role == "user" ? true : false}
          />
        ))}
      </div>
      <div className="input-container flex-center">
        <input
          type="text"
          placeholder="Enter.."
          className="form-control"
          autoComplete="off"
          autoSave="off"
          autoCorrect="off"
          value={msgContent}
          onChange={(e) => setMsgContent(e.target.value)}
          onKeyDown={handleSubmit}
        />
        {/* <span className="material-symbols-outlined input-send"> send </span> */}
      </div>
    </main>
  );
}

interface MessageRowProps {
  isUser: boolean;
  content: string;
}

function MessageRow({ isUser, content }: MessageRowProps) {
  const fixedContent = content.replace(/\n/g, "  \n");

  return (
    <div className={isUser ? "message-row user-message" : "message-row"}>
      <span className="markdown-body">
        <ReactMarkdown>{fixedContent}</ReactMarkdown>
        {/* {content} */}
      </span>
    </div>
  );
}
