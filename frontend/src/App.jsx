import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import { useAuth } from "./context/AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated()) {
    return <Navigate to="/feed" replace />;
  }
  return children;
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <PublicOnlyRoute>
          <Login />
        </PublicOnlyRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <PublicOnlyRoute>
          <Signup />
        </PublicOnlyRoute>
      }
    />
    <Route
      path="/feed"
      element={
        <PrivateRoute>
          <Feed />
        </PrivateRoute>
      }
    />
    <Route path="/" element={<Navigate to="/feed" replace />} />
    <Route path="*" element={<Navigate to="/feed" replace />} />
  </Routes>
);

export default App;
