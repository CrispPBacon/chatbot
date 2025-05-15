import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PublicRoute() {
  const { isLoading, auth } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  return auth?.user ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
}
