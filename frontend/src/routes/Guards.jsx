import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  // ⛔ wait until auth is ready
  if (isLoading) return <div>Loading...</div>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
export const RoleRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  // ⛔ wait for auth
  if (isLoading) return <div>Loading...</div>;

  // 🔐 not logged in
  if (!user) return <Navigate to="/login" replace />;

  // 🚫 wrong role → DON'T go to "/"
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />; // ✅ FIX
  }

  return <Outlet />;
};