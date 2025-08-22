import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export const ProtectedRoute = ({ roleRequired, children }) => {
  const { role } = useUser()

  if (role !== roleRequired) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
