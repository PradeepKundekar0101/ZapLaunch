import axios from 'axios';
import { useAppSelector } from '../store/hooks'
const useAxios = () => {
  const token  = useAppSelector((state:any) => {return state.auth.token});

  const instance = axios.create({
    //@ts-ignore
    baseURL:import.meta.env.VITE_BASE_URL+"/api/v1",
    headers: {
      "Authorization": `Bearer ${token}` || '',
       'X-Requested-With': 'XMLHttpRequest'
    },
  });
  instance.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  });
  return instance;
};

export default useAxios;