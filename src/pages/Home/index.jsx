import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
  BsGearFill,
  BsPersonCircle,
} from "react-icons/bs";
import * as S from "./style";

const MainPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [isMatching, setIsMatching] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [userProfile, setUserProfile] = useState({
    username: "사용자",
    totalMatches: 0,
  });
  const [mediaError, setMediaError] = useState("");

  useEffect(() => {
    initializeMedia();
    return () => {
      // 컴포넌트 언마운트 시 미디어 스트림 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // 초기 트랙 상태 설정
      stream.getVideoTracks().forEach((track) => (track.enabled = isCameraOn));
      stream.getAudioTracks().forEach((track) => (track.enabled = isMicOn));

      setMediaError("");
    } catch (error) {
      console.error("Media access error:", error);
      setMediaError("카메라 또는 마이크에 접근할 수 없습니다.");
      setIsCameraOn(false);
      setIsMicOn(false);
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const handleMatchingStart = () => {
    if (!streamRef.current) {
      setMediaError("카메라와 마이크를 활성화해주세요.");
      return;
    }
    setIsMatching(true);
    // 실제 매칭 로직 구현
    setTimeout(() => {
      navigate("/chat-room/123");
    }, 3000);
  };

  const handleMatchingCancel = () => {
    setIsMatching(false);
  };

  return (
    <S.Container>
      <S.Header>
        <S.Logo>
          <span>TokTok</span>
        </S.Logo>
        <S.ProfileSection>
          <S.ProfileButton>
            <BsPersonCircle />
            <span>{userProfile.username}</span>
          </S.ProfileButton>
          <S.SettingsButton>
            <BsGearFill />
          </S.SettingsButton>
        </S.ProfileSection>
      </S.Header>

      <S.Content>
        <S.VideoPreviewSection>
          <S.VideoPreview>
            {mediaError ? (
              <S.ErrorMessage>{mediaError}</S.ErrorMessage>
            ) : (
              <>
                <S.VideoElement
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  $isEnabled={isCameraOn}
                />
                {!isCameraOn && (
                  <S.DisabledOverlay>
                    <BsCameraVideoOffFill />
                    <span>카메라 꺼짐</span>
                  </S.DisabledOverlay>
                )}
              </>
            )}
          </S.VideoPreview>

          <S.ControlBar>
            <S.ControlButton
              onClick={toggleCamera}
              isActive={isCameraOn}
              title={isCameraOn ? "카메라 끄기" : "카메라 켜기"}
            >
              {isCameraOn ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
            </S.ControlButton>
            <S.ControlButton
              onClick={toggleMic}
              isActive={isMicOn}
              title={isMicOn ? "마이크 끄기" : "마이크 켜기"}
            >
              {isMicOn ? <BsFillMicFill /> : <BsFillMicMuteFill />}
            </S.ControlButton>
          </S.ControlBar>

          {isMatching ? (
            <S.MatchingStatus>
              <S.Spinner />
              <S.MatchingText>대화 상대를 찾고 있습니다...</S.MatchingText>
              <S.CancelButton onClick={handleMatchingCancel}>
                취소하기
              </S.CancelButton>
            </S.MatchingStatus>
          ) : (
            <S.StartButton
              onClick={handleMatchingStart}
              disabled={!streamRef.current}
            >
              대화 시작하기
            </S.StartButton>
          )}
        </S.VideoPreviewSection>

        <S.InfoSection>
          <S.InfoCard>
            <h3>오늘의 접속자</h3>
            <p>1,234명</p>
          </S.InfoCard>
          <S.InfoCard>
            <h3>현재 대화 중</h3>
            <p>89쌍</p>
          </S.InfoCard>
          <S.InfoCard>
            <h3>나의 대화 횟수</h3>
            <p>{userProfile.totalMatches}회</p>
          </S.InfoCard>
        </S.InfoSection>
      </S.Content>
    </S.Container>
  );
};

export default MainPage;
