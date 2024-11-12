import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.div`
  min-height: 100vh;
  background-color: #f8faff;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #2563eb;
`;

export const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8faff;
  border: none;
  border-radius: 8px;
  color: #1e40af;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
  }

  svg {
    font-size: 20px;
  }
`;

export const SettingsButton = styled.button`
  padding: 8px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
  }
`;

export const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  gap: 40px;
`;

export const VideoPreviewSection = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const PreviewPlaceholder = styled.div`
  color: #ffffff50;
  font-size: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const DisabledText = styled.span`
  font-size: 16px;
  color: #ffffff30;
`;

export const ControlBar = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const ControlButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  border: none;
  background: ${(props) => (props.isActive ? "#2563eb" : "#ef4444")};
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const MatchingStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const MatchingText = styled.p`
  color: #1e40af;
  font-size: 18px;
  font-weight: 500;
`;

export const CancelButton = styled.button`
  padding: 8px 16px;
  background: none;
  border: 2px solid #ef4444;
  color: #ef4444;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ef4444;
    color: white;
  }
`;

export const InfoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 800px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    font-size: 16px;
    color: #64748b;
    margin-bottom: 8px;
  }

  p {
    font-size: 24px;
    font-weight: 700;
    color: #1e40af;
  }
`;

export const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: ${(props) => (props.$isEnabled ? "none" : "scale(0)")};
  transition: transform 0.3s ease;
`;

export const DisabledOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1e1e1e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #ffffff50;

  svg {
    font-size: 48px;
  }

  span {
    font-size: 16px;
  }
`;

export const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 16px;
  text-align: center;
  padding: 20px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
`;

// VideoPreview 컴포넌트를 수정
export const VideoPreview = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: #1e1e1e;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

// StartButton을 수정하여 disabled 상태 추가
export const StartButton = styled.button`
  padding: 16px 32px;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
