import {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from "react";
import api from "../api/api";

interface UserProps {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  avatar: string;
}
interface childProp {
  children: React.ReactNode;
}

interface AuthContextType {
  auth: authProps | null;
  isLoading: boolean;
  conversationList: conversationProps[];
  setAuth: Dispatch<SetStateAction<authProps | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setConversationList: Dispatch<SetStateAction<conversationProps[]>>;
}
interface authProps {
  user: UserProps;
}

interface conversationProps {
  _id: string;
  user_id: string;
  title: string;
}

const initialContext: AuthContextType = {
  auth: null,
  isLoading: true,
  conversationList: [],
  setConversationList: () => {},
  setAuth: () => {},
  setLoading: () => {},
};

const AuthContext = createContext(initialContext);

export const AuthProvider = ({ children }: childProp) => {
  const [auth, setAuth] = useState<authProps | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [conversationList, setConversationList] = useState<conversationProps[]>(
    []
  );

  useEffect(() => {
    api
      .get("/api/login", { withCredentials: true })
      .then((res) => {
        setAuth({ user: res.data });
        setLoading(false);
      })
      .catch((e) => {
        console.log(e?.response?.data?.error || e);
        setAuth(null);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (auth?.user)
      api
        .get("/api/chat", { withCredentials: true })
        .then((res) => setConversationList(res.data))
        .catch((e) => console.log(e?.response?.data?.error || e));
    else setConversationList([]);
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        setLoading,
        auth,
        setAuth,
        conversationList,
        setConversationList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
