import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = { username, password };

    api
      .post("/api/login", { data }, { withCredentials: true })
      .then((res) => {
        setAuth({ user: res.data });
        navigate("/", { replace: true });
      })
      .catch((e) => setErrorMsg(e?.response?.data?.error.message || e.message));
  };

  return (
    <div className="auth-container light-shadow flex-center flex--column">
      <h3>Login</h3>
      <span className={errorMsg ? "auth-msg error" : "auth-msg"}>
        {errorMsg}
      </span>
      <form onSubmit={handleLogin} className="auth-form">
        <div className="form-item form-container">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            autoComplete="off"
            autoSave="off"
            autoCorrect="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-item form-container">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            autoComplete="off"
            autoSave="off"
            autoCorrect="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-container">
          <button className="btn btn-dark">Login</button>
        </div>
      </form>
      <p>
        Don't have an account?{" "}
        <a onClick={() => navigate("/signup")}>Sign up.</a>
      </p>
    </div>
  );
}
