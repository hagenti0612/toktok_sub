import React, { useState, useEffect, useRef } from "react";
import * as S from "./style";
import { getSocket } from "../../env/socket"; // 소켓 가져오기

const ChatRoom = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStream = useRef(null);
  const peerConnection = useRef(null);

  const [userList, setUserList] = useState([]);
  const [targetSocketId, setTargetSocketId] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const socket = getSocket(); // 단일 소켓 인스턴스 사용

  useEffect(() => {
    // 소켓 이벤트 등록
    socket.on("userList", (users) => setUserList(users || []));
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("candidate", handleCandidate);

    // 유저 목록 주기적 요청
    const fetchUsers = () => socket.emit("getUsers");
    fetchUsers();
    const intervalId = setInterval(fetchUsers, 5000);

    return () => {
      clearInterval(intervalId); // 타이머 정리
      socket.off("userList");
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, [socket]);

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
        <S.LocalVideoContainer>
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
        </S.UserListSection>
      </S.MainContent>
    </S.Container>
  );
};

export default ChatRoom;
