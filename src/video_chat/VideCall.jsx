import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001", {
  withCredentials: true,
  transports: ["websocket"],
});

function VideoCall() {
  const { roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const streamRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    const initMediaAndConnect = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      socket.emit("join-video-room", roomId);
    };

    initMediaAndConnect();

    socket.on("user-joined", async () => {
      await startCall(true);
    });

    socket.on("offer", async (offer) => {
      await startCall(false);
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async (answer) => {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("ICE candidate error", e);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const startCall = async (isCaller) => {
    const peer = new RTCPeerConnection(config);
    peerConnectionRef.current = peer;

    // Add local stream tracks
    streamRef.current.getTracks().forEach((track) => {
      peer.addTrack(track, streamRef.current);
    });

    // Receive remote stream
    peer.ontrack = (event) => {
      const [remoteStream] = event.streams;
      remoteVideoRef.current.srcObject = remoteStream;
    };

    // Handle ICE candidates
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomId, candidate: event.candidate });
      }
    };

    if (isCaller) {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit("offer", { roomId, offer });
    }
  };

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(prev => !prev);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(prev => !prev);
    }
  };

  return (
    <div className="p-2 bg-black   text-white space-y-6">
      <div className="flex gap-6 justify-center">
        <div>
          <h2 className="text-lg font-semibold mb-2">Your Video</h2>
          <video ref={localVideoRef} autoPlay muted playsInline className="w-64 h-48 bg-gray-800 rounded" />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Partner Video</h2>
          <video ref={remoteVideoRef} autoPlay playsInline className="w-64 h-48 bg-gray-800 rounded" />
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <button onClick={toggleVideo} className="text-white bg-gray-700 p-3 rounded-full hover:bg-gray-600">
          {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        <button onClick={toggleMute} className="text-white bg-gray-700 p-3 rounded-full hover:bg-gray-600">
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </div>
    </div>
  );
}

export default VideoCall;
