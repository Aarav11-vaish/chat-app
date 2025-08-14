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
  const initMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    socket.emit("join-video-room", roomId);
  };

  initMedia();

  socket.on("user-joined", async () => {
    if (streamRef.current) {
      await startCall(true);
    }
  });

  socket.on("offer", async (offer) => {
    if (!streamRef.current) {
      await initMedia(); // Ensure stream exists
    }
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
    if (candidate && peerConnectionRef.current) {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  });

  return () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    socket.off("user-joined");
    socket.off("offer");
    socket.off("answer");
    socket.off("ice-candidate");
  };
}, [roomId]);

const startCall = async (isCaller) => {
  const peer = new RTCPeerConnection(config);
  peerConnectionRef.current = peer;

  // ✅ Always add your own tracks
  streamRef.current.getTracks().forEach((track) => {
    peer.addTrack(track, streamRef.current);
  });

peer.ontrack = (event) => {
  const [remoteStream] = event.streams;
  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = remoteStream;
  }
};

if (localVideoRef.current) {
  localVideoRef.current.srcObject = streamRef.current;
}

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
    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 shadow-2xl border border-white/10">
      {/* Compact Video Layout */}
      <div className="flex gap-1 mb-2">
        <div className="relative">
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-40 h-32 bg-gray-800 rounded object-cover" 
          />
          <div className="absolute bottom-0 left-0 text-xs bg-black/60 px-1 rounded-tr text-white">You</div>
        </div>
        <div className="relative">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className="w-40 h-32 bg-gray-800 rounded object-cover" 
          />
          <div className="absolute bottom-0 left-0 text-xs bg-black/60 px-1 rounded-tr text-white">Guest</div>
        </div>
      </div>

      {/* Compact Controls */}
      <div className="flex justify-center gap-1">
        <button 
          onClick={toggleVideo} 
          className={`p-1.5 rounded-full transition-colors ${
            isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {isVideoOff ? <VideoOff size={14} className="text-white" /> : <Video size={14} className="text-white" />}
        </button>

        <button 
          onClick={toggleMute} 
          className={`p-1.5 rounded-full transition-colors ${
            isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {isMuted ? <MicOff size={14} className="text-white" /> : <Mic size={14} className="text-white" />}
        </button>
      </div>
    </div>
  );
}

export default VideoCall;