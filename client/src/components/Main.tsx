import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

const Sidebar = React.lazy(() => import("./Sidebar"));

export default function Main() {
  return (
    <>
      <Sidebar />
      <Suspense
        fallback={
          <div className="flex-center" style={{ width: "100%" }}>
            <div className="loader-bar"></div>
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </>
  );
}
