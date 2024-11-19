import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

//const socket = io('https://10.80.163.113:3001/');
//const socket = io('https://192.168.0.123:3001/');
const socket = io('https://substantial-adore-imds-2813ad36.koyeb.app', { secure: true });


function MultiVideoPage() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [userList, setUserList] = useState([]);
  const [targetSocketId, setTargetSocketId] = useState(null);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && targetSocketId) {
        socket.emit('candidate', {
          candidate: event.candidate,
          target: targetSocketId,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current = pc;
  };

  useEffect(() => {
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
      socket.disconnect();
    };
  }, []);

  const refreshUserList = () => {
    socket.emit('getUsers');
  };

  const startCall = async () => {
    if (!targetSocketId) {
      alert('Please select a user to call.');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit('offer', { sdp: offer, target: targetSocketId });
  };

  return (
    <div>
      <h1>React WebRTC Video Chat</h1>
      <div>
        <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }} />
        <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }} />
      </div>
      <div>
        <h3>Available Users</h3>
        <button onClick={refreshUserList}>Refresh User List</button>
        <ul>
          {userList.map((userId) => (
            <li key={userId} onClick={() => setTargetSocketId(userId)} style={{ cursor: 'pointer' }}>
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