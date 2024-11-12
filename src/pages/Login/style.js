// style.js
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

export const Container = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background-color: #f8faff;
`;

export const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const Circle = styled.div`
  position: absolute;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  background: linear-gradient(135deg, #60a5fa30 0%, #3b82f620 100%);
  border-radius: 50%;
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${(props) => props.delay};
`;

export const Content = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const LeftSection = styled.div`
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

export const WelcomeContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

export const LogoSection = styled.div`
  margin-bottom: 60px;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 36px;
  font-weight: 800;
  color: #2563eb;

  svg {
    font-size: 40px;
  }
`;

export const LogoSubtext = styled.p`
  margin-top: 8px;
  font-size: 18px;
  color: #64748b;
  margin-left: 4px;
`;

export const MainMessage = styled.div`
  margin-bottom: 60px;
`;

export const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  color: #1e40af;
  line-height: 1.2;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

export const Subtitle = styled.p`
  font-size: 20px;
  color: #64748b;
  line-height: 1.6;
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled.div`
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  svg {
    font-size: 24px;
    color: #2563eb;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
  }
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const LoginBox = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 40px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
`;

export const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h2 {
    font-size: 28px;
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 8px;
  }

  p {
    color: #64748b;
    font-size: 16px;
  }
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #475569;
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #f8faff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  color: #1e293b;
  transition: all 0.2s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }

  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  padding: 12px;
  background: #fee2e2;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);

    svg {
      transform: translateX(4px);
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

export const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 8px;

  a {
    color: #64748b;
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #2563eb;
    }
  }
`;

export const Divider = styled.span`
  color: #cbd5e1;
`;
