// index.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
  BsFillChatFill,
  BsHeartFill,
  BsXLg,
  BsSendFill,
} from "react-icons/bs";
import * as S from "./style";

const AudioLevelMeter = ({ stream, isEnabled }) => {
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const levelRef = useRef(null);

  useEffect(() => {
    if (!stream || !isEnabled) return;

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.5;
    microphone.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateLevel = () => {
      if (!levelRef.current) return;
      analyser.getByteFrequencyData(dataArray);

      const average =
        dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      const normalizedLevel = Math.min(average / 128, 1);

      if (levelRef.current) {
        levelRef.current.style.width = `${normalizedLevel * 100}%`;
        levelRef.current.style.background =
          normalizedLevel < 0.3
            ? "#4ade80"
            : normalizedLevel < 0.6
            ? "#fbbf24"
            : "#ef4444";
      }

      animationRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      microphone.disconnect();
      audioContext.close();
    };
  }, [stream, isEnabled]);

  if (!isEnabled) return null;

  return (
    <S.VolumeBar>
      <S.VolumeLevel ref={levelRef} $level={0} />
    </S.VolumeBar>
  );
};

const ChatRoom = () => {
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const streamRef = useRef(null);
  const chatContainerRef = useRef(null);
  const containerRef = useRef(null);

  const [localVideoPosition, setLocalVideoPosition] = useState({
    x: 40,
    y: 40,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mediaError, setMediaError] = useState("");

  useEffect(() => {
    initializeMedia();
    initializeDemoStream();

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleDrag, { passive: false });
    window.addEventListener("touchend", handleDragEnd);

    return () => {
      clearInterval(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDrag);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging]);

  const handleDragStart = (e) => {
    e.preventDefault();
    const touch = e.type === "touchstart" ? e.touches[0] : e;
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - localVideoPosition.x,
      y: touch.clientY - localVideoPosition.y,
    });
  };

  const handleDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.type === "touchmove" ? e.touches[0] : e;

    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const videoWidth = 240;
    const videoHeight = 135;

    let newX = touch.clientX - dragStart.x;
    let newY = touch.clientY - dragStart.y;

    newX = Math.max(20, Math.min(newX, containerRect.width - videoWidth - 20));
    newY = Math.max(
      20,
      Math.min(newY, containerRect.height - videoHeight - 20)
    );

    requestAnimationFrame(() => {
      setLocalVideoPosition({ x: newX, y: newY });
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

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

  const initializeDemoStream = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.src =
        "https://assets.mixkit.co/videos/preview/mixkit-young-woman-studying-and-taking-notes-with-a-tablet-8386-large.mp4";
      remoteVideoRef.current.play().catch((error) => {
        console.error("Demo video playback failed:", error);
      });
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      isMine: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");

    // 시연용 자동 응답
    setTimeout(() => {
      const responses = [
        "네, 알겠습니다!",
        "재미있네요 ㅎㅎ",
        "저도 그렇게 생각해요",
        "정말 그러네요~",
        "좋은 생각이에요!",
      ];
      const randomResponse = {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        isMine: false,
      };
      setMessages((prev) => [...prev, randomResponse]);
    }, 1000);

    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }, 100);
    }
  };

  const handleEndCall = () => {
    const confirmEnd = window.confirm("대화를 종료하시겠습니까?");
    if (confirmEnd) {
      // 스트림 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      navigate("/");
    }
  };

  const handleNextPerson = () => {
    const confirmNext = window.confirm("다음 사람과 대화하시겠습니까?");
    if (confirmNext) {
      // 실제 구현에서는 여기에 다음 사용자 매칭 로직이 들어가야 합니다
      // 데모 버전에서는 페이지 새로고침으로 시뮬레이션
      window.location.reload();
    }
  };

  return (
    <S.Container>
      <S.VideoSection>
        <S.MainContent ref={containerRef}>
          <S.RemoteVideoContainer>
            <video ref={remoteVideoRef} playsInline loop muted />
            <S.TimeDisplay>{formatTime(elapsedTime)}</S.TimeDisplay>
          </S.RemoteVideoContainer>

          <S.LocalVideoContainer
            $position={localVideoPosition}
            $isDragging={isDragging}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="local-video"
            />
            <AudioLevelMeter stream={streamRef.current} isEnabled={isMicOn} />
            {mediaError && (
              <S.ErrorOverlay>
                <p>{mediaError}</p>
              </S.ErrorOverlay>
            )}
            {!isCameraOn && (
              <S.DisabledOverlay>
                <BsCameraVideoOffFill />
                <span>카메라 꺼짐</span>
              </S.DisabledOverlay>
            )}
          </S.LocalVideoContainer>

          <S.ControlBar>
            <S.ControlGroup>
              <S.ControlButton
                onClick={toggleCamera}
                $isActive={isCameraOn}
                title={isCameraOn ? "카메라 끄기" : "카메라 켜기"}
              >
                {isCameraOn ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
              </S.ControlButton>
              <S.ControlButton
                onClick={toggleMic}
                $isActive={isMicOn}
                title={isMicOn ? "마이크 끄기" : "마이크 켜기"}
              >
                {isMicOn ? <BsFillMicFill /> : <BsFillMicMuteFill />}
              </S.ControlButton>
              <S.ControlButton
                onClick={() => setIsChatOpen(!isChatOpen)}
                $isActive={isChatOpen}
                title="채팅"
              >
                <BsFillChatFill />
              </S.ControlButton>
              <S.LikeButton
                onClick={() => setIsLiked(!isLiked)}
                $isLiked={isLiked}
                title={isLiked ? "좋아요 취소" : "좋아요"}
              >
                <BsHeartFill />
              </S.LikeButton>
            </S.ControlGroup>

            <S.ControlGroup>
              <S.NextButton onClick={handleNextPerson}>다음 사람</S.NextButton>
              <S.EndCallButton onClick={handleEndCall} title="통화 종료">
                <BsXLg />
              </S.EndCallButton>
            </S.ControlGroup>
          </S.ControlBar>
        </S.MainContent>

        <S.ChatSection $isOpen={isChatOpen}>
          <S.ChatHeader>
            <h3>채팅</h3>
            <button onClick={() => setIsChatOpen(false)}>
              <BsXLg />
            </button>
          </S.ChatHeader>

          <S.ChatMessages ref={chatContainerRef}>
            {messages.map((message) => (
              <S.Message key={message.id} $isMine={message.isMine}>
                <S.MessageContent $isMine={message.isMine}>
                  {message.text}
                </S.MessageContent>
              </S.Message>
            ))}
          </S.ChatMessages>

          <S.ChatInputForm onSubmit={handleSendMessage}>
            <S.ChatInput
              type="text"
              placeholder="메시지를 입력하세요"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <S.SendButton type="submit">
              <BsSendFill />
            </S.SendButton>
          </S.ChatInputForm>
        </S.ChatSection>
      </S.VideoSection>
    </S.Container>
  );
};

export default ChatRoom;
