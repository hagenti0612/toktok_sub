import axios from "axios";
import { useState } from "react";
import useTokenStore from "../../stores/useTokenStore";

const useLogin = () => {
  const [request, setRequest] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setAccessToken, setRefreshToken } = useTokenStore();

  const handleChange = (e) => {
    setRequest({ ...request, [e.target.name]: e.target.value });
  };

  const login = async ({ username, password }) => {
    setIsLoading(true);

    try {
      const {
        data: { data },
      } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        username,
        password,
      });

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, handleChange, request };
};

export default useLogin;
