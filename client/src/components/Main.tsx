import React from "react";
import { Outlet } from "react-router-dom";

const Sidebar = React.lazy(() => import("./Sidebar"));

export default function Main() {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
}
