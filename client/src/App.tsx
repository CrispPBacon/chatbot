import React from "react";
import "./css/index.css";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import PublicRoute from "./components/PublicRoute";

const Main = React.lazy(() => import("./components/Main"));
const Login = React.lazy(() => import("./components/Login"));
const Signup = React.lazy(() => import("./components/Signup"));
const ChatLayout = React.lazy(() => import("./components/ChatLayout"));
// const ChatNew = React.lazy(() => import("./components/ChatNew"));

export default function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<Main />}>
          <Route path="/" element={<ChatLayout />} />
          <Route path="/:id" element={<ChatLayout />} />
        </Route>
      </Route>
    </Routes>
  );
}
