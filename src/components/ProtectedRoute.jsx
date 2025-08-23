import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

/**
 * Waits for user hydration, then optionally enforces role.
 * Do NOT trigger Access redirects here; Access handles auth at the edge.
 */
export default function ProtectedRoute({ roleRequired, children }) {
  const { role, hydrated } = useUser();

  // Don't prematurely redirect while user info is loading
  if (!hydrated) return null; // or a spinner

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
}
