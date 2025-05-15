import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Signup() {
  const navigate = useNavigate();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatar, setAvatar] = useState("");

  const [errorMsg, setErrorMsg] = useState(true);
  const [infoMsg, setInfoMsg] = useState("");

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(true);
    if (password !== confirmPassword)
      return setInfoMsg("Password does not match");

    const data = {
      first_name,
      last_name,
      username,
      email,
      password,
      avatar,
    };

    api
      .post("/api/user", { data }, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setErrorMsg(false);
        setInfoMsg("Account successfully created!");
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      })
      .catch((e) => setInfoMsg(e?.response?.data?.error.message || e.message));
  };
  return (
    <div className="auth-container light-shadow flex-center flex--column">
      <h3>Sign up</h3>
      <span className={errorMsg ? "auth-msg error" : "auth-msg"}>
        {infoMsg}
      </span>
      <form onSubmit={handleSignup} className="auth-form">
        <div className="form-item form-container">
          <div className="flex--row">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              autoComplete="off"
              autoSave="off"
              autoCorrect="off"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
            &nbsp;
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              autoComplete="off"
              autoSave="off"
              autoCorrect="off"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
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
          <input
            type="text"
            className="form-control"
            placeholder="Email"
            autoComplete="off"
            autoSave="off"
            autoCorrect="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Password"
            autoComplete="off"
            autoSave="off"
            autoCorrect="off"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Avatar Image Link Url"
            autoComplete="off"
            autoSave="off"
            autoCorrect="off"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            style={{ marginTop: "2rem" }}
          />
        </div>
        <div className="form-item">
          <button className="btn btn-dark">Sign up</button>
        </div>
      </form>
      <p>
        Already have an account?{" "}
        <a onClick={() => navigate("/login")}>Login.</a>
      </p>
    </div>
  );
}
