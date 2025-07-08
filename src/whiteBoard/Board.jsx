import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import socket from "../socketboard";

const Board = () => {
  const { roomId } = useParams();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen");
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [elements, setElements] = useState([]);
  const [currentStrokeId, setCurrentStrokeId] = useState(null);

  // Fixed useEffect for socket handling
  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.off("drawing"); // ensure no duplicate listeners
    
    // ✅ FIXED: Remove destructuring, data comes directly
    socket.on("drawing", (data) => {
      if (!data?.strokeId) return;

      setElements((prev) => {
        const idx = prev.findIndex((el) => el.strokeId === data.strokeId);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = data;
          return updated;
        }
        return [...prev, data];
      });
    });

    return () => {
      socket.off("drawing");
    };
  }, [roomId]);

  // Draw on elements change
  useEffect(() => {
    redraw();
  }, [elements]);

  // Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redraw();
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getMousePos = (e) => ({
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
  });

  const startDrawing = (e) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);

    if (tool === 'pen') {
      const strokeId = uuidv4();
      setCurrentStrokeId(strokeId);
      const newElement = { type: 'pen', strokeId, points: [pos] };
      setElements((prev) => [...prev, newElement]);
      socket.emit("drawing", { roomId, data: newElement });
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);

    if (tool === "pen") {
      setElements((prev) => {
        const newElements = [...prev];
        const index = newElements.findIndex(
          (el) => el.strokeId === currentStrokeId
        );
        if (index !== -1) {
          newElements[index].points.push(pos);
          socket.emit("drawing", { roomId, data: newElements[index] });
        }
        return newElements;
      });
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    setIsDrawing(false);

    if (tool !== "pen") {
      const shape = {
        type: tool,
        startX: startPos.x,
        startY: startPos.y,
        endX: pos.x,
        endY: pos.y,
        strokeId: uuidv4(),
      };
      setElements((prev) => [...prev, shape]);
      socket.emit("drawing", { roomId, data: shape });
    }

    setCurrentStrokeId(null);
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;

    elements.forEach((el) => {
      ctx.beginPath();
      if (el.type === "pen" && el.points && el.points.length > 1) {
        ctx.moveTo(el.points[0].x, el.points[0].y);
        el.points.forEach((p) => ctx.lineTo(p.x, p.y));
      } else if (el.type === "line") {
        ctx.moveTo(el.startX, el.startY);
        ctx.lineTo(el.endX, el.endY);
      } else if (el.type === "rectangle") {
        ctx.rect(el.startX, el.startY, el.endX - el.startX, el.endY - el.startY);
      } else if (el.type === "circle") {
        const radius = Math.hypot(el.endX - el.startX, el.endY - el.startY);
        ctx.arc(el.startX, el.startY, radius, 0, 2 * Math.PI);
      }
      ctx.stroke();
    });
  };

  return (
    <div className="h-screen bg-blue-950 flex">
      <canvas
        ref={canvasRef}
        className="flex-1 cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default Board;