import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from "@/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = new URLSearchParams(location.search).get('token');
  const { data: userData, isLoading, isError } = useQuery({
    queryKey: ["userDetails", token],
    queryFn: async () => {
      if (!token) throw new Error("No token provided");
      const response = await axios.get("http://localhost:8000/api/v1/user/details", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: !!token, 
    retry: false
  });
  useEffect(() => {
    if (!token) {
      navigate('/login'); 
    } else if (userData) {
      console.log("first")
      console.log(userData.user)
      dispatch(login({ token, user: userData.user })); 
      navigate('/'); 
    }
  }, [token, userData, dispatch, navigate]);

  if (isLoading) return <div>Fetching user details...</div>;
  if (isError) return <div>Failed to authenticate. Please try again.</div>;

  return <div>Authenticating...</div>;
};

export default AuthCallback;
