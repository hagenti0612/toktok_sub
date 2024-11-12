import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../Layout";
import Home from "../../pages/Home";
import VideoChat from "../../pages/VideoChat";
import Login from "../../pages/Login";
import SignUp from "../../pages/SignUp";
import ChatRoom from "../../pages/ChatRoom";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/video-chat" element={<VideoChat />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat-room" element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
