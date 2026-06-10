import { useEffect, useRef, useState, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { io, Socket } from 'socket.io-client';

interface Peer {
  peerId: string;
  peer: SimplePeer.Instance;
  stream?: MediaStream;
}

interface UseWebRTCProps {
  roomId: string;
  userId: string;
  userName: string;
}

export const useWebRTC = ({ roomId, userId, userName }: UseWebRTCProps) => {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Peer[]>([]);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize local media stream
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      // Try audio only if video fails
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localStreamRef.current = audioStream;
        setLocalStream(audioStream);
        return audioStream;
      } catch (audioError) {
        console.error('Error accessing audio:', audioError);
        return null;
      }
    }
  }, []);

  // Create peer connection
  const createPeer = useCallback(
    (peerId: string, initiator: boolean, stream: MediaStream) => {
      const peer = new SimplePeer({
        initiator,
        trickle: false,
        stream,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      });

      peer.on('signal', (signal) => {
        socketRef.current?.emit('signal', {
          signal,
          to: peerId,
          from: userId,
          roomId,
        });
      });

      peer.on('stream', (remoteStream) => {
        setPeers((prevPeers) =>
          prevPeers.map((p) =>
            p.peerId === peerId ? { ...p, stream: remoteStream } : p
          )
        );
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
      });

      peer.on('close', () => {
        console.log('Peer connection closed:', peerId);
      });

      return peer;
    },
    [userId, roomId]
  );

  // Add peer
  const addPeer = useCallback(
    (peerId: string, initiator: boolean, stream: MediaStream) => {
      const peer = createPeer(peerId, initiator, stream);
      const newPeer: Peer = { peerId, peer };

      peersRef.current = [...peersRef.current, newPeer];
      setPeers((prevPeers) => [...prevPeers, newPeer]);

      return peer;
    },
    [createPeer]
  );

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  // Initialize WebRTC connection
  useEffect(() => {
    const init = async () => {
      // Initialize socket connection
      socketRef.current = io(window.location.origin, {
        path: '/api/socket',
      });

      const stream = await initializeMedia();
      if (!stream) return;

      // Join room
      socketRef.current.emit('join-room', {
        roomId,
        userId,
        userName,
      });

      // Handle existing users in room
      socketRef.current.on('room-users', (users: string[]) => {
        users.forEach((peerId) => {
          if (peerId !== userId) {
            addPeer(peerId, true, stream);
          }
        });
      });

      // Handle new user joining
      socketRef.current.on('user-joined', ({ userId: newUserId }) => {
        if (newUserId !== userId) {
          addPeer(newUserId, false, stream);
        }
      });

      // Handle receiving signal
      socketRef.current.on(
        'signal',
        ({ signal, from }: { signal: SimplePeer.SignalData; from: string }) => {
          const peerObj = peersRef.current.find((p) => p.peerId === from);
          if (peerObj) {
            peerObj.peer.signal(signal);
          } else {
            const peer = addPeer(from, false, stream);
            peer.signal(signal);
          }
        }
      );

      // Handle user leaving
      socketRef.current.on('user-left', ({ userId: leftUserId }) => {
        const peerObj = peersRef.current.find((p) => p.peerId === leftUserId);
        if (peerObj) {
          peerObj.peer.destroy();
          peersRef.current = peersRef.current.filter(
            (p) => p.peerId !== leftUserId
          );
          setPeers((prevPeers) =>
            prevPeers.filter((p) => p.peerId !== leftUserId)
          );
        }
      });
    };

    init();

    // Cleanup
    return () => {
      // Stop all tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Destroy all peer connections
      peersRef.current.forEach((peer) => {
        peer.peer.destroy();
      });

      // Disconnect socket
      if (socketRef.current) {
        socketRef.current.emit('leave-room', { roomId, userId });
        socketRef.current.disconnect();
      }
    };
  }, [roomId, userId, userName, initializeMedia, addPeer]);

  return {
    peers,
    localStream,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
  };
};

// Made with Bob
