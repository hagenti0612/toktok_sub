// style.js
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #0f172a;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const VideoSection = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 24px;
`;

export const RemoteVideoContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #1e293b;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const TimeDisplay = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(8px);
  animation: ${fadeIn} 0.3s ease;
`;

export const LocalVideoContainer = styled.div`
  position: absolute;
  top: ${(props) => props.$position.y}px;
  left: ${(props) => props.$position.x}px;
  width: 240px;
  height: 135px;
  background: #1e293b;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${(props) =>
    props.$isDragging
      ? "0 12px 36px rgba(0, 0, 0, 0.3)"
      : "0 8px 24px rgba(0, 0, 0, 0.2)"};
  border: 2px solid rgba(255, 255, 255, 0.1);
  cursor: ${(props) => (props.$isDragging ? "grabbing" : "grab")};
  user-select: none;
  touch-action: none;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  transform: ${(props) => (props.$isDragging ? "scale(1.02)" : "scale(1)")};
  will-change: transform;

  &:hover {
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
`;

export const VolumeBar = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
`;

export const VolumeLevel = styled.div`
  height: 100%;
  width: 0%;
  transition: width 0.1s linear, background-color 0.2s ease;
`;

export const ErrorOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(239, 68, 68, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  color: white;
  font-size: 14px;
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.3s ease;
`;

export const DisabledOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: white;
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.3s ease;

  svg {
    font-size: 32px;
    opacity: 0.8;
  }

  span {
    font-size: 14px;
    opacity: 0.8;
  }
`;

export const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px;
  position: relative;
  z-index: 10;
  margin-top: 24px;
`;

export const ControlGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const ControlButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  border: none;
  background: ${(props) =>
    props.$isActive ? "rgba(255, 255, 255, 0.1)" : "#ef4444"};
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);

  &:hover {
    transform: translateY(-2px);
    background: ${(props) =>
      props.$isActive ? "rgba(255, 255, 255, 0.15)" : "#dc2626"};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const LikeButton = styled(ControlButton)`
  background: ${(props) =>
    props.$isLiked ? "#ec4899" : "rgba(255, 255, 255, 0.1)"};

  &:hover {
    background: ${(props) =>
      props.$isLiked ? "#db2777" : "rgba(255, 255, 255, 0.15)"};
  }
`;

export const NextButton = styled.button`
  padding: 0 24px;
  height: 48px;
  border-radius: 24px;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const EndCallButton = styled(ControlButton)`
  background: #ef4444;

  &:hover {
    background: #dc2626;
  }
`;

export const ChatSection = styled.div`
  width: 360px;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(16px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }

  button {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #1e293b;
    }
  }
`;

export const ChatMessages = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
`;

export const Message = styled.div`
  display: flex;
  justify-content: ${(props) => (props.$isMine ? "flex-end" : "flex-start")};
  animation: ${fadeIn} 0.3s ease;
`;

export const MessageContent = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  background: ${(props) => (props.$isMine ? "#3b82f6" : "#f1f5f9")};
  color: ${(props) => (props.$isMine ? "white" : "#1e293b")};
  border-radius: ${(props) =>
    props.$isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px"};
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  word-break: break-word;
`;

export const ChatInputForm = styled.form`
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: none;
  background: #3b82f6;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;
