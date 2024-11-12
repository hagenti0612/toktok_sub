import * as S from "./style";

const Header = () => {
  return (
    <S.Container>
      <S.Nav>
        <S.NavItem to="/">Home</S.NavItem>
        <S.NavItem to="/video-chat">Video Chat</S.NavItem>
      </S.Nav>

      <S.Profile>
        <S.ProfileImage src="https://avatars.githubusercontent.com/u/57570806?v=4" />
      </S.Profile>
    </S.Container>
  );
};

export default Header;
