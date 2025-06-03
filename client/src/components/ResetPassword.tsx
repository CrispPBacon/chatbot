import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api"; // Import your axios instance

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>(); // Extract token from URL params

  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    // Using .then() and .catch() for the API request
    api
      .post(`/api/reset-password/${token}`, { password })
      .then((res) => {
        setMessage(res.data.message);
        setPassword(""); // Reset the password input field
      })
      .catch((err) => {
        setErrorMsg(
          err?.response?.data?.message || err.message || "Something went wrong"
        );
      });
  };

  return (
    <div className="auth-container light-shadow flex-center flex--column">
      <h3>Reset Password</h3>
      <span className={errorMsg ? "auth-msg error" : "auth-msg"}>
        {errorMsg}
      </span>
      <span className={message ? "auth-msg success" : "auth-msg"}>
        {message}
      </span>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-item form-container">
          <input
            type="password"
            className="form-control"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            required
            minLength={6}
          />
        </div>
        <div className="form-container">
          <button className="btn btn-dark">Reset Password</button>
        </div>
      </form>
      <p>
        Remember your password? <a onClick={() => navigate("/login")}>Login.</a>
      </p>
    </div>
  );
}
