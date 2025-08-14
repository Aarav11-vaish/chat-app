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

let isDrawing = false;
let startX, startY;
const radius = Math.hypot(el.endX - el.startX, el.endY - el.startY);
        ctx.arc(el.startX, el.startY, radius, 0, (2 * Math.PI));
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

  // Tool icons and labels
  const toolConfig = {
    pen: { icon: "✏️", label: "Pen" },
    text: { icon: "📝", label: "Text" },
    line: { icon: "📏", label: "Line" },
    rectangle: { icon: "⬛", label: "Rectangle" },
    circle: { icon: "⭕", label: "Circle" }
  };

  return (
    <div className="relative  bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Video Call Overlay */}
      <div className="absolute top-2 right-4 z-50 drop-shadow-2xl">
        <VideoCall />
      </div>

      {/* Professional Sidebar */}
      <div className="w-60 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="border-b border-white/20 pb-4">
            <h2 className="text-2xl font-bold text-white mb-1">Whiteboard Studio</h2>
            <p className="text-sm text-white/70">Room: {roomId?.slice(-6)}</p>
          </div>

          {/* Drawing Tools */}
          <div>
            <h3 className="text-sm font-semibold text-white/90 mb-3 uppercase tracking-wide">Drawing Tools</h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(toolConfig).map(([t, config]) => (
                <button
                  key={t}
                  onClick={() => {
                    setTool(t);
                    console.log("Tool selected:", t); // Debug log
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    tool === t 
                      ? "bg-blue-500 text-white shadow-lg transform scale-105" 
                      : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{config.icon}</span>
                  <span>{config.label}</span>
                  {tool === t && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <h3 className="text-sm font-semibold text-white/90 mb-3 uppercase tracking-wide">Color Palette</h3>
            <div className="grid grid-cols-4 gap-3">
              {["#FFFFFF", "#FF4444", "#44FF44", "#4444FF", "#FFFF44", "#FF44FF", "#44FFFF", "#000000"].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                    color === c ? "border-white shadow-lg" : "border-white/30 hover:border-white/60"
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && (
                    <div className="w-full h-full rounded-md flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Brush Settings */}
          <div>
            <h3 className="text-sm font-semibold text-white/90 mb-3 uppercase tracking-wide">Brush Settings</h3>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-white/80">Thickness</label>
                <span className="text-sm font-medium text-white">{thickness}px</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={thickness}
                onChange={(e) => setThickness(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(thickness-1)*11.11}%, rgba(255,255,255,0.2) ${(thickness-1)*11.11}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={clearBoard}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🗑️ Clear Board
            </button>
          </div>

          {/* Status Indicators */}
          <div className="border-t border-white/20 pt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Active Tool:</span>
              <span className="text-white font-medium capitalize">{toolConfig[tool]?.label}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Auto-saved locally</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-slate-900">
        {/* Canvas Grid Pattern */}
        <div className="absolute inset-0 opacity-20" 
             style={{
               backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }}>
        </div>
        
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair relative z-10"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        {/* Enhanced Text Input */}
        {textInput.show && (
          <div className="absolute flex z-50" style={{ left: `${textInput.x}px`, top: `${textInput.y}px` }}>
            <input
              autoFocus
              className="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-1 text-base rounded-lg border-2 border-blue-500 shadow-2xl min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              style={{
                fontSize: "16px",
                transform: 'translate(0, 10%)',
              }}
              value={textInput.text}
              onChange={(e) => setTextInput((prev) => ({ ...prev, text: e.target.value }))}
              onKeyDown={handleTextSubmit}
              onBlur={handleTextBlur}
              placeholder="Type your text here..."
            />
            <div className="text-xs text-white/60 mt-1 text-center">Press Enter to confirm, Esc to cancel</div>
          </div>
        )}
      </div>

      {/* Custom CSS for slider styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default Board;