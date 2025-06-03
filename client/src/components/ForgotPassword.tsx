import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    // Using .then() and .catch() instead of async/await
    api
      .post("/api/forgot-password", { data: { email } })
      .then((res) => {
        setMessage(res.data.message);
        setEmail(""); // Reset the email input field
      })
      .catch((err) => {
        setErrorMsg(
          err?.response?.data?.message || err.message || "Something went wrong"
        );
      });
  };

  return (
    <div className="auth-container light-shadow flex-center flex--column">
      <h3>Forgot Password</h3>
      <span className={errorMsg ? "auth-msg error" : "auth-msg"}>
        {errorMsg}
      </span>
      <span className={message ? "auth-msg success" : "auth-msg"}>
        {message}
      </span>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-item form-container">
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            required
          />
        </div>
        <div className="form-container">
          <button className="btn btn-dark">Send Reset Link</button>
        </div>
      </form>
      <p>
        Remember your password? <a onClick={() => navigate("/login")}>Login.</a>
      </p>
    </div>
  );
}
