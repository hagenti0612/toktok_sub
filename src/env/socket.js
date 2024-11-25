import { io } from "socket.io-client";

// 단일 소켓 인스턴스 생성
let socket;

export const getSocket = () => {
  if (!socket) {
    const socket = io('https://substantial-adore-imds-2813ad36.koyeb.app', { secure: true });
  }
  return socket;
};