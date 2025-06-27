import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '../context/UserContext';

const ProtectedRoute = () => {
  const { isLoggedIn, authChecked } = useUserData();

  if (!authChecked) {
    return <div>Loading...</div>; 
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;