import { Navigate } from "react-router-dom";
import { useGlobalContext } from "@/context/GlobalContext";

const PrivateRoute = ({ children }) => {
  const { loginEmail } = useGlobalContext(); // 获取 loginEmail
  const isAuthenticated = Boolean(loginEmail); // 判断用户是否认证

  console.log("Is authenticated:", isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
