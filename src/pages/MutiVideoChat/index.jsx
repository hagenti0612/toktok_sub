import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://substantial-adore-imds-2813ad36.koyeb.app', { secure: true });

function MultiVideoPage() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const [userList, setUserList] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]); // 연결된 유저 목록
  const [targetSocketId, setTargetSocketId] = useState(null);
  const [isLocalVideoOn, setIsLocalVideoOn] = useState(true);

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

    socket.on('offer', async (data) => {
      if (!peerConnection.current) {
        createPeerConnection(data.caller);
      }

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.sdp));

      // 로컬 스트림 추가
      await setupLocalStream();

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer', { sdp: answer, target: data.caller });

      setConnectedUsers((prev) => [...prev, data.caller]); // 연결된 유저 추가
    });

    socket.on('answer', async (data) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
        setConnectedUsers((prev) => [...prev, data.caller]); // 연결된 유저 추가
      }
    });

    socket.on('candidate', (data) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate)).catch((error) => {
          console.error('Error adding received ICE Candidate:', error);
        });
      }
    });

    socket.on('connect', () => {
      socket.emit('getUsers');
    });

    return () => {
      socket.disconnect();
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, []);

  const setupLocalStream = async () => {
    if (!localStream.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localVideoRef.current.srcObject = stream;
        localStream.current = stream;

        // PeerConnection에 로컬 트랙 추가
        stream.getTracks().forEach((track) => {
          if (peerConnection.current) {
            peerConnection.current.addTrack(track, stream);
          }
        });
      } catch (error) {
        console.error('Error accessing local media:', error);
        alert('Could not access your camera and microphone. Please check your browser settings.');
      }
    }
  };

  const createPeerConnection = (userId) => {
    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', {
          candidate: event.candidate,
          target: userId,
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
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch((error) => {
          console.error('Error playing remote video:', error);
        });
      }
    };

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.current);
      });
    }

    peerConnection.current = pc;
  };

  const refreshUserList = () => {
    socket.emit('getUsers');
  };

  const startCall = async () => {
    if (!targetSocketId) {
      alert('Please select a user to call.');
      return;
    }

    if (!peerConnection.current) {
      createPeerConnection(targetSocketId);
    }

    try {
      await setupLocalStream();

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit('offer', { sdp: offer, target: targetSocketId });

      setConnectedUsers((prev) => [...prev, targetSocketId]); // 연결된 유저 추가
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const toggleLocalVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsLocalVideoOn((prevState) => !prevState);
    }
  };

  const playRemoteVideo = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.play().catch((error) => {
        console.error('Error playing remote video manually:', error);
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
        <button onClick={toggleLocalVideo}>
          {isLocalVideoOn ? 'Turn Off Video' : 'Turn On Video'}
        </button>
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
              onClick={() => !connectedUsers.includes(userId) && setTargetSocketId(userId)}
              style={{
                cursor: connectedUsers.includes(userId) ? 'not-allowed' : 'pointer',
                color: connectedUsers.includes(userId) ? 'gray' : 'black',
                textDecoration: connectedUsers.includes(userId) ? 'line-through' : 'none',
              }}
            >
              {userId} {connectedUsers.includes(userId) && '(Connected)'}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={startCall} disabled={!targetSocketId || connectedUsers.includes(targetSocketId)}>
        Start Call
      </button>
    </div>
  );
}

export default MultiVideoPage;

