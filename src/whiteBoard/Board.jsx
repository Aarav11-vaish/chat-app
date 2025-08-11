import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import socket from "../socketboard";
import VideoCall from "../video_chat/VideCall";

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
  const [textInput, setTextInput] = useState({ show: true, x: 10, y: 10, text: "" });
  const [isInitialized, setIsInitialized] = useState(false);

  // Save to sessionStorage whenever elements change (only after initialization)
  useEffect(() => {
    if (isInitialized && elements.length >= 0) {
      sessionStorage.setItem(`whiteboard-${roomId}`, JSON.stringify({
        elements,
        timestamp: Date.now()
      }));
    }
  }, [elements, roomId, isInitialized]);

  // Socket setup and data loading
  useEffect(() => {
    socket.emit("join-room", roomId);
    
    // Try to load from sessionStorage first
    const saved = sessionStorage.getItem(`whiteboard-${roomId}`);
    if (saved) {
      try {
        const { elements: savedElements, timestamp } = JSON.parse(saved);
        // (less than 5 minutes old)
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setElements(savedElements);
        }
      } catch (e) {
        console.error("Error parsing saved data:", e);
      }
    }

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

    setIsInitialized(true);

    return () => {
      socket.off("drawing");
    };
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

  const getScreenPos = (e) => {
    // Get position relative to the viewport for input positioning
    return {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const startDrawing = (e) => {
    const canvasPos = getMousePos(e);
    const screenPos = getScreenPos(e);
    
    setIsDrawing(true);
    setStartPos(canvasPos);
    
    if (tool === 'text') {
      console.log("Text tool clicked at:", canvasPos); // Debug log
      setTextInput({ 
        show: true, 
        x: canvasPos.x, 
        y: canvasPos.y, 
       
        text: "" 
      });
      return;
    }
    
    if (tool === 'pen') {
      const strokeId = uuidv4();
      setCurrentStrokeId(strokeId);
      const newElement = { type: 'pen', strokeId, points: [canvasPos], color, thickness };
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
    if (!isDrawing || tool === 'text') return;// what is this for? 


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
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render all elements
    elements.forEach((el) => {
      ctx.strokeStyle = el.color || "#FFFFFF";
      ctx.lineWidth = el.thickness || 2;
      ctx.beginPath();
      
      if (el.type === "pen" && el.points?.length > 1) {
        ctx.moveTo(el.points[0].x, el.points[0].y);
        el.points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      } else if (el.type === "line") {
        ctx.moveTo(el.startX, el.startY);
        ctx.lineTo(el.endX, el.endY);
        ctx.stroke();
      } else if (el.type === "rectangle") {
        ctx.rect(el.startX, el.startY, el.endX - el.startX, el.endY - el.startY);
        ctx.stroke();
      } else if (el.type === "circle") {
        const radius = Math.hypot(el.endX - el.startX, el.endY - el.startY);
        ctx.arc(el.startX, el.startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (el.type === "text") {
        // Important: Reset context for text rendering
        ctx.save();
        ctx.fillStyle = el.color || "#FFFFFF";
        ctx.font = `${el.fontSize || 20}px Arial`;
        ctx.textBaseline = "top"; // Important for consistent positioning
        ctx.fillText(el.text, el.x, el.y);
        ctx.restore();
      }
    });
  };

  const handleTextSubmit = (e) => {
    if (e.key === 'Enter' && textInput.text.trim()) {
      console.log("Submitting text:", textInput.text); // Debug log
      const textElement = {
        type: 'text',
        x: textInput.x,
        y: textInput.y,
        text: textInput.text,
        color,
        fontSize: 20, // Increased font size for better visibility
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
      console.log("Text blur with content:", textInput.text); // Debug log
      const textElement = {
        type: 'text',
        x: textInput.x,
        y: textInput.y,
        text: textInput.text,
        color,
        fontSize: 20,
        strokeId: uuidv4(),
      };
      setElements((prev) => [...prev, textElement]);
      socket.emit("drawing", { roomId, data: textElement });
    }
    setTextInput({ show: true, x: canvasPos.x, y: canvasPos.y, text: "" }); // handle input 
  };

  const clearBoard = () => {
    setElements([]);
    sessionStorage.removeItem(`whiteboard-${roomId}`);
    socket.emit("clear-board", roomId);
  };

  return (
    <div className="relative h-screen bg-blue-1000 flex">
      {/* Video Call Overlay */}
      <div className="absolute top-4 right-4 z-50">
        <VideoCall />
      </div>

      {/* Sidebar Tools */}
      <div className="w-64 bg-gray-900 p-4 text-white space-y-4">
        <h3 className="text-lg font-bold">Tools</h3>
        <div className="grid grid-cols-2 gap-1">
          {["pen", "text", "line", "rectangle", "circle"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTool(t);
                console.log("Tool selected:", t); // Debug log
              }}
              className={`rounded px-4 py-2 text-sm ${
                tool === t ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <h3 className="text-sm mt-4">Colors</h3>
        <div className="grid grid-cols-6 gap-1">
          {["#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"].map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="w-5 h-5 border border-white"
              style={{ backgroundColor: c }}
            ></button>
          ))}
        </div>

        <h3 className="text-sm mt-4">Thickness</h3>
        <input
          type="range"
          min={1}
          max={10}
          value={thickness}
          onChange={(e) => setThickness(parseInt(e.target.value))}
        />

        {/* Clear Board Button */}
        <button
          onClick={clearBoard}
          className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm mt-4"
        >
          Clear Board
        </button>

        {/* Current tool indicator */}
        <div className="text-xs text-gray-400 mt-2">
          Current tool: <span className="text-white">{tool}</span>
        </div>
        
        {/* Data persistence indicator */}
        <div className="text-xs text-gray-400">
          💾 Auto-saved locally
        </div>
      </div>

      {/* Whiteboard Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        {/* Text Input Overlay - Fixed positioning */}
        {textInput.show && (
          <input
            autoFocus
            className="absolute bg-slate-400 text-black p-2 text-base rounded border-2 shadow-lg z-50"
            style={{
              left: `${textInput.x}px`, // Use canvas coordinates directly
              top: `${textInput.y}px`,
              minWidth: "150px",
              fontSize: "16px",
              transform: 'translate(0, -50%)', // Center vertically on click point
            }}
            value={textInput.text}
            onChange={(e) => setTextInput((prev) => ({ ...prev, text: e.target.value }))}
            onKeyDown={handleTextSubmit}
            onBlur={handleTextBlur}
            placeholder="Type text here..."
          />
        )}
      </div>
    </div>
  );
};

export default Board;