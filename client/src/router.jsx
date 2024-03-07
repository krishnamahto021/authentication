import { Navigate, createBrowserRouter } from "react-router-dom";
import SignUpForm from "./pages/SignUpForm";
import Spinner from "./components/Spinner";
import UserPost from "./pages/UserPosts";
import VerifyPage from "./pages/VerifyPage";
import ResetPasswordForm from "./pages/ResetPasswordForm";
import UpdatePasswordForm from "./pages/UpdatePasswordForm";
import { useSelector } from "react-redux";
import { userSelector } from "./redux/userReducer";

export const ProtectedRouteHome = ({ element }) => {
  const { loggedInUser } = useSelector(userSelector);
  return loggedInUser ? element : <Spinner />;
};

export const ProtectedRoute = ({ element }) => {
  const { loggedInUser } = useSelector(userSelector);
  return loggedInUser?.jwtToken ? <Navigate to={"/user/posts"} /> : element;
};

export const router = createBrowserRouter([
  { path: "/", element: <ProtectedRoute element={<SignUpForm />} /> },
  {
    path: "/user/posts",
    element: <ProtectedRouteHome element={<UserPost />} />,
  },
  {
    path: "/verify-user/:token",
    element: <ProtectedRoute element={<VerifyPage />} />,
  },
  {
    path: "/reset-password",
    element: <ProtectedRoute element={<ResetPasswordForm />} />,
  },
  {
    path: "/update-password/:token",
    element: <ProtectedRoute element={<UpdatePasswordForm />} />,
  },
]);
