import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
  BsFillChatFill,
  BsHeartFill,
} from "react-icons/bs";
import * as S from "./style";
import io from "socket.io-client";

const socket = io('https://substantial-adore-imds-2813ad36.koyeb.app', { secure: true });

const ChatRoom = () => {
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStream = useRef(null);
  const peerConnection = useRef(null);

  const [localVideoPosition, setLocalVideoPosition] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [userList, setUserList] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [targetSocketId, setTargetSocketId] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const config = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      {
        urls: 'turn:43.203.120.136:3478',
        username: 'toktok',
        credential: 'toktok1234!',
      },
    ],
  };

  useEffect(() => {
    socket.on("userList", (users) => setUserList(users));
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("candidate", handleCandidate);

    return () => {
      socket.disconnect();
      if (peerConnection.current) peerConnection.current.close();
    };
  }, []);

  const handleOffer = async ({ sdp, caller }) => {
    if (!peerConnection.current) createPeerConnection(caller);

    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
    await setupLocalStream();

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.emit("answer", { sdp: answer, target: caller });

    setConnectedUsers((prev) => [...prev, caller]);
  };

  const handleAnswer = async ({ sdp, caller }) => {
    if (peerConnection.current) {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
      setConnectedUsers((prev) => [...prev, caller]);
    }
  };

  const handleCandidate = ({ candidate }) => {
    if (peerConnection.current) {
      peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const setupLocalStream = async () => {
    if (!localStream.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.current = stream;
        localVideoRef.current.srcObject = stream;

        stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
      } catch (error) {
        console.error("Unable to access camera or microphone:", error);
      }
    }
  };

  const createPeerConnection = (userId) => {
    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", { candidate: event.candidate, target: userId });
      }
    };

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current = pc;
  };

  const startCall = async () => {
    if (!targetSocketId) {
      alert("Please select a user to call.");
      return;
    }

    if (!peerConnection.current) createPeerConnection(targetSocketId);

    await setupLocalStream();

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("offer", { sdp: offer, target: targetSocketId });

    setConnectedUsers((prev) => [...prev, targetSocketId]);
  };

  const toggleCamera = () => {
    const videoTracks = localStream.current.getVideoTracks();
    videoTracks.forEach((track) => (track.enabled = !track.enabled));
    setIsCameraOn(!isCameraOn);
  };

  const toggleMic = () => {
    const audioTracks = localStream.current.getAudioTracks();
    audioTracks.forEach((track) => (track.enabled = !track.enabled));
    setIsMicOn(!isMicOn);
  };

  return (
    <S.Container>
      <S.VideoSection>
        <S.MainContent>
          <S.RemoteVideoContainer>
            <video ref={remoteVideoRef} playsInline />
            <S.TimeDisplay>{elapsedTime}s</S.TimeDisplay>
          </S.RemoteVideoContainer>

          <S.LocalVideoContainer
            $position={localVideoPosition || { x: 40, y: 40 }}
            $isDragging={isDragging || false}
            onMouseDown={(e) => {
              const { clientX, clientY } = e;
              setIsDragging(true);
              setDragStart({ x: clientX - localVideoPosition.x, y: clientY - localVideoPosition.y });
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseMove={(e) => {
              if (isDragging) {
                const { clientX, clientY } = e;
                setLocalVideoPosition({ x: clientX - dragStart.x, y: clientY - dragStart.y });
              }
            }}
          >
            {localStream.current ? (
              <video ref={localVideoRef} autoPlay muted />
            ) : (
              <S.ErrorOverlay>No Video Stream Available</S.ErrorOverlay>
            )}
          </S.LocalVideoContainer>

          <S.ControlBar>
            <S.ControlGroup>
              <S.ControlButton onClick={toggleCamera}>
                {isCameraOn ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
              </S.ControlButton>
              <S.ControlButton onClick={toggleMic}>
                {isMicOn ? <BsFillMicFill /> : <BsFillMicMuteFill />}
              </S.ControlButton>
              <S.ControlButton onClick={() => setIsChatOpen(!isChatOpen)}>
                <BsFillChatFill />
              </S.ControlButton>
              <S.LikeButton onClick={() => setIsLiked(!isLiked)}>
                <BsHeartFill />
              </S.LikeButton>
            </S.ControlGroup>
          </S.ControlBar>
        </S.MainContent>
      </S.VideoSection>

      <S.UserListSection>
        <h3>Available Users</h3>
        <S.UserList>
          {userList.map((userId) => (
            <S.UserListItem
              key={userId}
              onClick={() => !connectedUsers.includes(userId) && setTargetSocketId(userId)}
              $isConnected={connectedUsers.includes(userId)}
            >
              {userId} {connectedUsers.includes(userId) && "(Connected)"}
            </S.UserListItem>
          ))}
        </S.UserList>
        <S.CallButton onClick={startCall} disabled={!targetSocketId || connectedUsers.includes(targetSocketId)}>
          Start Call
        </S.CallButton>
      </S.UserListSection>
    </S.Container>
  );
};

export default ChatRoom;
