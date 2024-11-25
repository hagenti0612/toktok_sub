import React, { useState, useEffect, useRef } from "react";
import * as S from "./style"; // 스타일 컴포넌트 가져오기
import io from "socket.io-client";

const socket = io('https://substantial-adore-imds-2813ad36.koyeb.app', { secure: true });

const ChatRoom = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStream = useRef(null);
  const peerConnection = useRef(null);

  const [userList, setUserList] = useState([]);
  const [targetSocketId, setTargetSocketId] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [localVideoPosition, setLocalVideoPosition] = useState({ x: 40, y: 40 });

  useEffect(() => {
    // 서버에서 유저 목록 수신
    socket.on("userList", (users) => {
      setUserList(users || []);
    });

    // Offer 수신
    socket.on("offer", async ({ sdp, caller }) => {
      if (!peerConnection.current) createPeerConnection(caller);

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      // 연결된 유저 정보 추가
      setConnectedUsers((prev) => [...prev, caller]);

      socket.emit("answer", { sdp: answer, target: caller });
    });

    // Answer 수신
    socket.on("answer", async ({ sdp }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    });

    // ICE Candidate 수신
    socket.on("candidate", ({ candidate }) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // 주기적으로 유저 목록 갱신 요청
    const fetchUsers = () => socket.emit("getUsers");
    fetchUsers();
    const intervalId = setInterval(fetchUsers, 5000);

    return () => {
      clearInterval(intervalId); // 정리
      socket.off("userList");
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, []);

  const refreshUserList = () => {
    socket.emit("getUsers");
  };

  const startCall = async () => {
    if (!targetSocketId) {
      alert("Please select a user to call.");
      return;
    }

    if (!peerConnection.current) {
      createPeerConnection(targetSocketId);
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStream.current = stream;
    localVideoRef.current.srcObject = stream;

    stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    // 연결된 유저 정보 추가
    setConnectedUsers((prev) => [...prev, targetSocketId]);

    socket.emit("offer", { sdp: offer, target: targetSocketId });
  };

  const createPeerConnection = (userId) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:your-turn-server.com:3478',
          username: 'your-username',
          credential: 'your-credential',
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
          <S.RefreshButton onClick={refreshUserList}>Refresh Users</S.RefreshButton>
        </S.UserListSection>
      </S.MainContent>
    </S.Container>
  );
};

export default ChatRoom;
