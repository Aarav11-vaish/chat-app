import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function VideoCall() {
  const { roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [isCallStarted, setIsCallStarted] = useState(false);

  const config = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    socket.emit("join-video-room", roomId);

    socket.on("user-joined", async () => {
      console.log("User joined, starting call");
      await startCall(true);
    });

    socket.on("offer", async (offer) => {
      console.log("Received offer");
      await startCall(false);
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async (answer) => {
      console.log("Received answer");
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async (candidate) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding ICE candidate", e);
        }
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId]);

  const startCall = async (isCaller) => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = localStream;

    const peer = new RTCPeerConnection(config);
    peerConnectionRef.current = peer;

    localStream.getTracks().forEach((track) => {
      peer.addTrack(track, localStream);
    });

    peer.ontrack = (event) => {
      const [stream] = event.streams;
      remoteVideoRef.current.srcObject = stream;
    };

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

    setIsCallStarted(true);
  };

  return (
    <div className="flex gap-4 p-4 bg-black text-white">
      <div>
        <h2 className="text-lg font-semibold">Your Video</h2>
        <video ref={localVideoRef} autoPlay muted playsInline className="w-64 h-48 bg-gray-800 rounded" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Partner Video</h2>
        <video ref={remoteVideoRef} autoPlay playsInline className="w-64 h-48 bg-gray-800 rounded" />
      </div>
    </div>
  );
}

export default VideoCall;
