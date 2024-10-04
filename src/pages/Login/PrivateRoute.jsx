import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

import { useGlobalContext } from "@/context/GlobalContext";

const PrivateRoute = ({ children }) => {
  const { loginEmail } = useGlobalContext();
  const isAuthenticated = Boolean(loginEmail);

  console.log("Is authenticated:", isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" replace />;
};
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
