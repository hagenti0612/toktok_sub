import axios from "axios";
import { useState } from "react";
import useTokenStore from "../../stores/useTokenStore";

const useSignUp = () => {
  const [request, setRequest] = useState({
    email: "",
    username: "",
    password: "",
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setRequest({ ...request, [e.target.name]: e.target.value });
  };

  const signup = async () => {
    setIsLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, request);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, handleChange, request };
};

export default useSignUp;
