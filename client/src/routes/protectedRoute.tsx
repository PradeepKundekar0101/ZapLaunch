import {  useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAppSelector((state) => state?.auth?.token);
  const navigate = useNavigate();
  useEffect(()=>{
    if (!token) {
      toast({title:"Please login",variant:"destructive"})
      navigate("/");
      return
    }
    try {
      const decodedToken: any = jwtDecode(token);
      console.log(decodedToken)
      if (decodedToken.expiresIn * 1000 < Date.now()) {
        alert("Session Expired")
        navigate("/");
        return
      }
    } catch (error) { 
      navigate("/");
      return;
    }
  },[token])
  return children;
};
