import {  useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { jwtDecode } from "jwt-decode";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAppSelector((state) => state?.auth?.token);
  const navigate = useNavigate();
  if (!token) {
    navigate("/login");
    return
  }
  try {
    const decodedToken: any = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      alert("Session Expired")
      navigate("/login");
      return
    }
  } catch (error) { 
    navigate("/login");
    return;
  }
  return children;
};
