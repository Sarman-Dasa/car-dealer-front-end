import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  
  const userInfo = useSelector((state) => state.app.user);

  if (userInfo) {
    return <Outlet />;
  } else {
    return <Navigate to="/access-error" />;
  }
};

export default ProtectedRoute;