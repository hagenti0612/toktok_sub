import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

//const socket = io('https://10.80.163.113:3001/');
//const socket = io('https://192.168.0.123:3001/');
const socket = io('https://substantial-adore-imds-2813ad36.koyeb.app', { secure: true });


function MultiVideoPage() {
  const localVideoRef = useRef(null);
  const [peerConnections, setPeerConnections] = useState({});
  const [userList, setUserList] = useState([]);
  const localStream = useRef(null); // 로컬 스트림 참조

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
    socket.on('userList', (users) => {
      setUserList(users);
    });

    socket.on('offer', async ({ sdp, caller }) => {
      const pc = createPeerConnection(caller);
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { sdp: answer, target: caller });
    });

    socket.on('answer', async ({ sdp, caller }) => {
      const pc = peerConnections[caller];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    });

    socket.on('candidate', ({ candidate, caller }) => {
      const pc = peerConnections[caller];
      if (pc) {
        pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((error) => {
          console.error('Error adding ICE Candidate:', error);
        });
      }
    });

    socket.on('connect', () => {
      socket.emit('getUsers');
    });

    return () => {
      Object.values(peerConnections).forEach((pc) => pc.close());
      setPeerConnections({});
      socket.disconnect();
    };
  }, [peerConnections]);

  const createPeerConnection = (userId) => {
    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', { candidate: event.candidate, target: userId });
      }
    };

    pc.ontrack = (event) => {
      addRemoteStream(event.streams[0], userId);
    };

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.current);
      });
    }

    setPeerConnections((prev) => ({ ...prev, [userId]: pc }));
    return pc;
  };

  const addRemoteStream = (stream, userId) => {
    const videoContainer = document.getElementById('remoteVideos');
    let videoElement = document.getElementById(`video-${userId}`);

    if (!videoElement) {
      videoElement = document.createElement('video');
      videoElement.id = `video-${userId}`;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.style.width = '300px';
      videoContainer.appendChild(videoElement);
    }

    videoElement.srcObject = stream;
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current.srcObject = stream;
      localStream.current = stream;

      userList.forEach((userId) => {
        if (!peerConnections[userId]) {
          const pc = createPeerConnection(userId);
          pc.createOffer()
            .then((offer) => {
              pc.setLocalDescription(offer);
              socket.emit('offer', { sdp: offer, target: userId });
            })
            .catch((error) => {
              console.error('Error creating offer:', error);
            });
        }
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  return (
    <div>
      <h1>React WebRTC Multi-User Video Chat</h1>
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
        <h3>Remote Videos</h3>
        <div id="remoteVideos" style={{ display: 'flex', flexWrap: 'wrap' }}></div>
      </div>
      <div>
        <h3>Available Users</h3>
        <button onClick={() => socket.emit('getUsers')}>Refresh User List</button>
        <ul>
          {userList.map((userId) => (
            <li key={userId} style={{ cursor: 'pointer' }}>
              {userId}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={startCall}>Start Call</button>
    </div>
  );
}

export default MultiVideoPage;