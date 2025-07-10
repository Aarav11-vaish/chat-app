import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import socket from "../socketboard";

const Board = () => {
  const { roomId } = useParams();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#FFFFFF");
  const [thickness, setThickness] = useState(2);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [elements, setElements] = useState([]);
  const [currentStrokeId, setCurrentStrokeId] = useState(null);
  const [textInput, setTextInput] = useState({ show: false, x: 0, y: 0, text: "" });

  useEffect(() => {
    socket.emit("join-room", roomId);
    socket.off("drawing");
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
    return () => socket.off("drawing");
  }, [roomId]);

  useEffect(() => { redraw(); }, [elements]);

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

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);
    if (tool === 'text') {
      setTextInput({ show: true, x: pos.x, y: pos.y, text: "" });
      return;
    }
    if (tool === 'pen') {
      const strokeId = uuidv4();
      setCurrentStrokeId(strokeId);
      const newElement = { type: 'pen', strokeId, points: [pos], color, thickness };
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
        const index = newElements.findIndex((el) => el.strokeId === currentStrokeId);
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
    if (tool !== "pen" && tool !== "text") {
      const shape = {
        type: tool,
        startX: startPos.x,
        startY: startPos.y,
        endX: pos.x,
        endY: pos.y,
        strokeId: uuidv4(),
        color,
        thickness,
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
    elements.forEach((el) => {
      ctx.strokeStyle = el.color || "#FFFFFF";
      ctx.lineWidth = el.thickness || 2;
      ctx.beginPath();
      if (el.type === "pen" && el.points?.length > 1) {
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
      } else if (el.type === "text") {
        ctx.fillStyle = el.color || "#FFFFFF";
        ctx.font = `${el.fontSize || 16}px Arial`;
        ctx.fillText(el.text, el.x, el.y);
      }
      if (el.type !== "text") ctx.stroke();
    });
  };

  const handleTextSubmit = (e) => {
    if (e.key === 'Enter' && textInput.text.trim()) {
      const textElement = {
        type: 'text',
        x: textInput.x,
        y: textInput.y,
        text: textInput.text,
        color,
        fontSize: 16,
        strokeId: uuidv4(),
      };
      setElements((prev) => [...prev, textElement]);
      socket.emit("drawing", { roomId, data: textElement });
      setTextInput({ show: false, x: 0, y: 0, text: "" });
    } else if (e.key === 'Escape') {
      setTextInput({ show: false, x: 0, y: 0, text: "" });
    }
  };

  const handleTextBlur = () => {
    if (textInput.text.trim()) {
      const textElement = {
        type: 'text',
        x: textInput.x,
        y: textInput.y,
        text: textInput.text,
        color,
        fontSize: 16,
        strokeId: uuidv4(),
      };
      setElements((prev) => [...prev, textElement]);
      socket.emit("drawing", { roomId, data: textElement });
    }
    setTextInput({ show: false, x: 0, y: 0, text: "" });
  };

  return (
    <div className="h-screen bg-blue-1000 flex">
      <div className="w-64 bg-gray-900 p-4 text-white space-y-4">
        <h3 className="text-lg font-bold">Tools</h3>
        <div className="grid grid-cols-2 gap-1">
          {["pen", "text", "line", "rectangle", "circle"].map((t) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className={`rounded px-4 py-2 text-sm ${tool === t ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"}`}
            >{t}</button>
          ))}
        </div>
        <h3 className="text-sm mt-4">Colors</h3>
        <div className="grid grid-cols-6 gap-1">
          {["#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"].map((c) => (
            <button key={c} onClick={() => setColor(c)} className="w-5 h-5 border border-white" style={{ backgroundColor: c }}></button>
          ))}
        </div>
        <h3 className="text-sm mt-4">Thickness</h3>
        <input type="range" min={1} max={10} value={thickness} onChange={(e) => setThickness(parseInt(e.target.value))} />
      </div>
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        {textInput.show && (
          <input
            autoFocus
            className="absolute bg-white text-black p-2 text-sm rounded border-2 border-blue-500 shadow-lg"
            style={{
              left: `${textInput.x + 268}px`, // Offset for sidebar width
              top: `${textInput.y}px`,
              zIndex: 1000,
              minWidth: '150px',
              fontSize: '14px',
            }}
            value={textInput.text}
            onChange={(e) => setTextInput((prev) => ({ ...prev, text: e.target.value }))}
            onKeyDown={handleTextSubmit}
            onBlur={handleTextBlur}
          />
        )}
      </div>
    </div>
  );
};

export default Board;