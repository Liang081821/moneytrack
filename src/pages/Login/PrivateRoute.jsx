import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

import { useGlobalContext } from "@/context/GlobalContext";

const PrivateRoute = ({ children }) => {
  const { loginEmail } = useGlobalContext();
  const isAuthenticated = Boolean(loginEmail);

  return isAuthenticated ? children : <Navigate to="/" replace />;
};
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
