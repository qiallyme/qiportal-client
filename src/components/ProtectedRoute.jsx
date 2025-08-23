import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

/**
 * Minimal guard:
 * - Do NOT trigger login redirects here. Cloudflare Access already does that.
 * - Optionally gate by role if you pass roleRequired.
 */
export default function ProtectedRoute({ roleRequired, children }) {
  const { role } = useUser();

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
}
