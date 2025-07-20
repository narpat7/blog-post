// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const isAuth = localStorage.getItem("authenticated");
//   console.log("Auth Check:", isAuth);
//   return isAuth === "true" ? children : <Navigate to="/login" />;
// }

// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");

//   // Optional: console log for debugging
//   console.log("Token found:", token);

//   // If token exists, allow access; else redirect to login
//   return token ? children : <Navigate to="/login" />;
// }

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first!");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
