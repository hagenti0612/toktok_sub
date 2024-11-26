import React, { useState, useEffect, useRef } from "react";
import * as S from "./style";
import socket from "../../env/socket"; // 소켓 가져오기

const ChatRoom = () => {
  const [userId, setUserId] = useState(""); // 유저 ID 상태
  const [userList, setUserList] = useState([]);
  const [targetSocketId, setTargetSocketId] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [localVideoPosition, setLocalVideoPosition] = useState({ x: 40, y: 40 });

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStream = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    // 소켓 이벤트 등록
    socket.on("userList", (users) => setUserList(users || []));
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("candidate", handleCandidate);
    // 서버로부터 유저 ID 수신
    socket.on("yourId", (id) => {
      console.log("Your user ID:", id);
      setUserId(id); // 유저 ID 상태 설정
    });

    // 유저 목록 갱신 주기적 요청
    const fetchUsers = () => socket.emit("getUsers");
    fetchUsers();
    const intervalId = setInterval(fetchUsers, 5000);

    return () => {
      clearInterval(intervalId); // 타이머 정리
      socket.off("yourId");
      socket.off("userList");
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, []);

  const handleOffer = async ({ sdp, caller }) => {
    if (!peerConnection.current) createPeerConnection(caller);

    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    setConnectedUsers((prev) => [...prev, caller]);
    socket.emit("answer", { sdp: answer, target: caller });
  };

  const handleAnswer = async ({ sdp }) => {
    if (peerConnection.current) {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
    }
  };

  const handleCandidate = ({ candidate }) => {
    if (peerConnection.current) {
      peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const startCall = async () => {
    if (!targetSocketId) {
      alert("Please select a user to call.");
      return;
    }

    if (!peerConnection.current) createPeerConnection(targetSocketId);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStream.current = stream;
    localVideoRef.current.srcObject = stream;

    stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    setConnectedUsers((prev) => [...prev, targetSocketId]);
    socket.emit("offer", { sdp: offer, target: targetSocketId });
  };

  const createPeerConnection = (userId) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:43.203.120.136:3478',
          username: 'toktok',
          credential: 'toktok1234!',

        },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", { candidate: event.candidate, target: userId });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch((error) => {
          console.error("Error playing remote video:", error);
        });
      }
    };

    peerConnection.current = pc;
  };

  return (
    <S.Container>
      <S.MainContent>
        <S.RemoteVideoContainer>
          <video ref={remoteVideoRef} playsInline autoPlay />
        </S.RemoteVideoContainer>
        <S.LocalVideoContainer
          $position={localVideoPosition}
          $isDragging={isDragging}
          onMouseDown={(e) => {
            setIsDragging(true);
            setLocalVideoPosition({
              x: e.clientX - localVideoRef.current.offsetLeft,
              y: e.clientY - localVideoRef.current.offsetTop,
            });
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseMove={(e) => {
            if (isDragging) {
              setLocalVideoPosition({
                x: e.clientX,
                y: e.clientY,
              });
            }
          }}
        >
          <video ref={localVideoRef} playsInline autoPlay muted />
        </S.LocalVideoContainer>
        <S.UserListSection>
          <h3>Available Users</h3>
          <S.UserList>
            {userList.length > 0 ? (
              userList.map((user) => (
                <S.UserListItem
                  key={user}
                  onClick={() => setTargetSocketId(user)}
                  $isConnected={connectedUsers.includes(user)}
                >
                  {user} {connectedUsers.includes(user) && "(Connected)"}
                </S.UserListItem>
              ))
            ) : (
              <div>No users available</div>
            )}
          </S.UserList>
          <S.CallButton onClick={startCall} disabled={!targetSocketId}>
            Start Call
          </S.CallButton>
          <S.RefreshButton onClick={() => socket.emit("getUsers")}>
            Refresh Users
          </S.RefreshButton>
        </S.UserListSection>
      </S.MainContent>
    </S.Container>
  );
};

export default ChatRoom;
