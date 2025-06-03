import React from "react";
import "./css/index.css";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import PublicRoute from "./components/PublicRoute";

const Main = React.lazy(() => import("./components/Main"));
const Login = React.lazy(() => import("./components/Login"));
const Signup = React.lazy(() => import("./components/Signup"));
const ChatLayout = React.lazy(() => import("./components/ChatLayout"));
const AdminLayout = React.lazy(() => import("./components/AdminLayout"));
const ForgotPassword = React.lazy(() => import("./components/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./components/ResetPassword"));

export default function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<Main />}>
          <Route path="/" element={<ChatLayout />} />
          <Route path="/:id" element={<ChatLayout />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />} />
      </Route>
    </Routes>
  );
}
