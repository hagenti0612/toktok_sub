import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

//const socket = io('https://10.80.163.113:3001/');
//const socket = io('https://192.168.0.123:3001/');
const socket = io('https://substantial-adore-imds-2813ad36.koyeb.app', { secure: true });


function MultiVideoPage() {
  const localVideoRef = useRef(null); // 로컬 비디오 참조
  const remoteVideoRef = useRef(null); // 원격 비디오 참조
  const peerConnection = useRef(null); // RTCPeerConnection 객체 참조
  const [userList, setUserList] = useState([]); // 연결된 사용자 목록
  const [targetSocketId, setTargetSocketId] = useState(null); // 선택된 상대방의 Socket ID

  // STUN 서버 설정
  const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  useEffect(() => {
    // Signaling Server 이벤트 설정
    socket.on('userList', (users) => {
      setUserList(users);
    });

    socket.on('offer', async (data) => {
      if (!peerConnection.current) createPeerConnection();

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer', { sdp: answer, target: data.caller });
      setTargetSocketId(data.caller);
    });

    socket.on('answer', async (data) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      setTargetSocketId(data.caller);
    });

    socket.on('candidate', (data) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    socket.on('connect', () => {
      socket.emit('getUsers');
    });

    return () => {
      // 컴포넌트 언마운트 시 정리
      socket.disconnect();
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, []);

  // PeerConnection 생성 함수
  const createPeerConnection = () => {
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
      if (event.candidate && targetSocketId) {
        socket.emit('candidate', {
          candidate: event.candidate,
          target: targetSocketId,
        });
      }
    };
  
    pc.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', pc.iceConnectionState);
  
      if (pc.iceConnectionState === 'disconnected') {
        console.log('Attempting to restart ICE...');
        pc.restartIce();
      }
    };
  
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        if (remoteVideoRef.current.srcObject) {
          remoteVideoRef.current.srcObject = null;
        }
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch((error) => {
          console.error('Error playing remote video:', error);
        });
      }
    };
  
    return pc;
  };

  // 사용자 목록 갱신
  const refreshUserList = () => {
    socket.emit('getUsers');
  };

  // 통화 시작
  const startCall = async () => {
    if (!targetSocketId) {
      alert('Please select a user to call.');
      return;
    }

    // PeerConnection 초기화 확인
  if (!peerConnection.current) {
    createPeerConnection();
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    console.log('Local stream acquired:', stream);

    localVideoRef.current.srcObject = stream;

    stream.getTracks().forEach((track) => {
      console.log('Adding track:', track);
      peerConnection.current.addTrack(track, stream); // 초기화 보장
    });

    const offer = await peerConnection.current.createOffer();
    console.log('Created offer:', offer);

    await peerConnection.current.setLocalDescription(offer);

    socket.emit('offer', { sdp: offer, target: targetSocketId });
  } catch (error) {
    console.error('Error in startCall:', error);
  }
  };

  // 원격 비디오 재생 (브라우저 자동 재생 문제 해결)
  const playRemoteVideo = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.play().catch((error) => {
        console.error('Error playing remote video:', error);
      });
    }
  };

  return (
    <div>
      <h1>React WebRTC Video Chat</h1>
      <div>
        <h3>Local Video</h3>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{ width: '300px', backgroundColor: 'black' }}
        />
      </div>
      <div>
        <h3>Remote Video</h3>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: '300px', backgroundColor: 'black' }}
        />
        <button onClick={playRemoteVideo}>Play Remote Video</button>
      </div>
      <div>
        <h3>Available Users</h3>
        <button onClick={refreshUserList}>Refresh User List</button>
        <ul>
          {userList.map((userId) => (
            <li
              key={userId}
              onClick={() => setTargetSocketId(userId)}
              style={{
                cursor: 'pointer',
                color: targetSocketId === userId ? 'blue' : 'black',
              }}
            >
              {userId} {targetSocketId === userId && '(Selected)'}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={startCall}>Start Call</button>
    </div>
  );
}

export default MultiVideoPage;