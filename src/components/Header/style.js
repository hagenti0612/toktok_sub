import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

export const Container = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: fixed;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 0 2rem;
  gap: 4rem;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

export const NavItem = styled(NavLink)`
  color: #333;
  text-decoration: none;
  margin: 0 1rem;
  font-size: 1.2rem;
  font-weight: 600;

  &.active {
    color: #fff;
    text-decoration: underline;
    text-underline-offset: 0.5rem;
    text-decoration-color: #fff;
  }
`;

export const Profile = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;
