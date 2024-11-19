import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

//const socket = io('https://10.80.163.113:3001/');
//const socket = io('https://192.168.0.123:3001/');
const socket = io('https://substantial-adore-imds-2813ad36.koyeb.app', { secure: true });



function MultiVidePage() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [isCalling, setIsCalling] = useState(false);

  const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  useEffect(() => {
    socket.on('offer', async (data) => {
      console.log('Received Offer:', data);
    
      // PeerConnection이 없으면 생성
      if (!peerConnection.current) {
        createPeerConnection();
      }
    
      // Offer를 Remote Description으로 설정
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.sdp)
      );
    
      // Answer 생성
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
    
      console.log('Sending Answer:', answer);
    
      // Signaling Server로 Answer 전송
      socket.emit('answer', { sdp: answer, target: data.caller });
    });
  
    socket.on('answer', async (data) => {
      // 상대방의 Answer를 설정
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.sdp)
      );
    });
  
    socket.on('candidate', (data) => {
      // ICE Candidate를 추가
      peerConnection.current.addIceCandidate(new RTCIceCandidate(data));
    });
    socket.on('connect', () => {
      console.log('Connected to Signaling Server2:', socket.id);
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from Signaling Server');
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
  
    // ICE Candidate 처리
    pc.onicecandidate = (event) => {
      console.log('Remote onicecandidate:', event.candidate);
      if (event.candidate) {
        socket.emit('candidate', { candidate: event.candidate });
      }
    };
  
    // Remote Stream 처리
    pc.ontrack = (event) => {
      console.log('Remote track received:', event.streams[0]);
  
      // remoteVideoRef에 스트림 연결
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  
    peerConnection.current = pc;
  };

  const startCall = async () => {
    createPeerConnection();

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    stream.getTracks().forEach((track) =>
      peerConnection.current.addTrack(track, stream)
    );

    localVideoRef.current.srcObject = stream;

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit('offer', { sdp: offer });
    setIsCalling(true);
  };
  const remoteCall = async () => {
    createPeerConnection();
  }

  return (
    <div>
      <h1>React WebRTC Video Chat</h1>
      <div>
        <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }} />
        <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }} />
      </div>
      <button onClick={startCall}>Start Call</button>
      <button onClick={remoteCall}>Remote Call</button>
    </div>
  );
}

export default MultiVidePage;


