// index.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  BsCameraVideoFill,
  BsPeopleFill,
  BsChatSquareHeartFill,
  BsStars,
  BsArrowRightCircle,
} from "react-icons/bs";
import * as S from "./style";

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          username: credentials.username,
          password: credentials.password,
        }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/chat");
    } catch {
      setError("아이디 또는 비밀번호가 일치하지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Container>
      <S.Background>
        <S.Circle top="-10%" left="-5%" size="300px" delay="0s" />
        <S.Circle top="60%" left="45%" size="200px" delay="0.3s" />
        <S.Circle top="20%" left="70%" size="250px" delay="0.6s" />
      </S.Background>

      <S.Content>
        <S.LeftSection>
          <S.WelcomeContent>
            <S.LogoSection>
              <S.Logo>
                <BsStars />
                <span>TokTok</span>
              </S.Logo>
              <S.LogoSubtext>랜덤 화상채팅</S.LogoSubtext>
            </S.LogoSection>

            <S.MainMessage>
              <S.Title>
                똑똑한 만남,
                <br />
                즐거운 대화
              </S.Title>
              <S.Subtitle>TokTok과 함께 새로운 인연을 만들어보세요</S.Subtitle>
            </S.MainMessage>

            <S.FeatureGrid>
              <S.FeatureCard>
                <BsCameraVideoFill />
                <h3>실시간 매칭</h3>
                <p>빠르고 간편한 매칭 시스템</p>
              </S.FeatureCard>
              <S.FeatureCard>
                <BsPeopleFill />
                <h3>다양한 만남</h3>
                <p>새로운 친구들과의 대화</p>
              </S.FeatureCard>
              <S.FeatureCard>
                <BsChatSquareHeartFill />
                <h3>대화 필터</h3>
                <p>관심사 기반 매칭</p>
              </S.FeatureCard>
            </S.FeatureGrid>
          </S.WelcomeContent>
        </S.LeftSection>

        <S.RightSection>
          <S.LoginBox>
            <S.LoginHeader>
              <h2>로그인</h2>
              <p>TokTok과 함께 시작해보세요!</p>
            </S.LoginHeader>

            <S.LoginForm onSubmit={handleSubmit}>
              <S.InputGroup>
                <S.Label htmlFor="username">아이디</S.Label>
                <S.InputWrapper>
                  <S.Input
                    id="username"
                    type="text"
                    name="username"
                    placeholder="아이디를 입력하세요"
                    value={credentials.username}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </S.InputWrapper>
              </S.InputGroup>

              <S.InputGroup>
                <S.Label htmlFor="password">비밀번호</S.Label>
                <S.InputWrapper>
                  <S.Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="비밀번호를 입력하세요"
                    value={credentials.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </S.InputWrapper>
              </S.InputGroup>

              {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

              <S.LoginButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  "로그인 중..."
                ) : (
                  <>
                    시작하기
                    <BsArrowRightCircle />
                  </>
                )}
              </S.LoginButton>

              <S.FooterLinks>
                <Link to="/find-account">계정찾기</Link>
                <S.Divider>|</S.Divider>
                <Link to="/signup">회원가입</Link>
              </S.FooterLinks>
            </S.LoginForm>
          </S.LoginBox>
        </S.RightSection>
      </S.Content>
    </S.Container>
  );
};

export default LoginPage;
