import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

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

  const createPeerConnection = () => {
    const peer = new RTCPeerConnection(config);

    // Handle remote stream
    const remoteStream = new MediaStream();
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }

    peer.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
    };

    // Handle ICE candidates
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomId, candidate: event.candidate });
      }
    };

    peerConnectionRef.current = peer;
    return peer;
  };

  const initMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  };

  useEffect(() => {
    initMedia().then(() => {
      socket.emit("join-video-room", roomId);
    });

    socket.on("user-joined", async () => {
      const peer = createPeerConnection();

      // Add local tracks before creating offer
      streamRef.current.getTracks().forEach(track => {
        peer.addTrack(track, streamRef.current);
      });

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit("offer", { roomId, offer });
    });

    socket.on("offer", async (offer) => {
      const peer = createPeerConnection();

      streamRef.current.getTracks().forEach(track => {
        peer.addTrack(track, streamRef.current);
      });

      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async (answer) => {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async (candidate) => {
      if (candidate && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
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

  const toggleMute = () => {
    streamRef.current?.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(prev => !prev);
  };

  const toggleVideo = () => {
    streamRef.current?.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsVideoOff(prev => !prev);
  };

  return (
    <div className="p-2 bg-black text-white space-y-6">
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
