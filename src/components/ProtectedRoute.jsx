import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function ProtectedRoute({ roleRequired, children }) {
  const { role, hydrated } = useUser();
  if (!hydrated) return null;
  if (roleRequired && role !== roleRequired) return <Navigate to="/" replace />;
  return children;
}