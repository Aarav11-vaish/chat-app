import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3000");

const Board = () => {
  const { roomId } = useParams();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [elements, setElements] = useState([]);

  useEffect(() => {
    socket.emit("join-room", roomId);
    socket.on("drawing", (incomingData) => {
      setElements((prev) => [...prev, incomingData]);
    });
    return () => {
      socket.off("drawing");
    };
  }, [roomId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redraw();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getMousePos = (e) => ({
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY
  });

  const startDrawing = (e) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);

    if (tool === 'pen') {
      const newElement = { type: 'pen', points: [pos] };
      setElements((prev) => [...prev, newElement]);
      socket.emit("drawing", { roomId, data: newElement });
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);

    if (tool === 'pen') {
      setElements((prev) => {
        const newElements = [...prev];
        const currentElement = newElements[newElements.length - 1];
        currentElement.points.push(pos);
        socket.emit("drawing", { roomId, data: currentElement });
        return newElements;
      });
    }

    redraw();
    drawPreview(pos);
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;

    setIsDrawing(false);
    const pos = getMousePos(e);

    if (tool !== 'pen') {
      const newElement = {
        type: tool,
        startX: startPos.x,
        startY: startPos.y,
        endX: pos.x,
        endY: pos.y
      };
      setElements((prev) => [...prev, newElement]);
      socket.emit("drawing", { roomId, data: newElement });
    }

    redraw();
  };

  const drawPreview = (currentPos) => {
    if (tool === 'pen') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    redraw();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();

    if (tool === 'rectangle') {
      ctx.rect(startPos.x, startPos.y, currentPos.x - startPos.x, currentPos.y - startPos.y);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(currentPos.x - startPos.x, 2) + Math.pow(currentPos.y - startPos.y, 2)
      );
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
    } else if (tool === 'line') {
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(currentPos.x, currentPos.y);
    }

    ctx.stroke();
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();

      if (element.type === 'pen') {
        if (element.points.length > 1) {
          ctx.moveTo(element.points[0].x, element.points[0].y);
          for (let i = 1; i < element.points.length; i++) {
            ctx.lineTo(element.points[i].x, element.points[i].y);
          }
        }
      } else if (element.type === 'rectangle') {
        ctx.rect(
          element.startX,
          element.startY,
          element.endX - element.startX,
          element.endY - element.startY
        );
      } else if (element.type === 'circle') {
        const radius = Math.sqrt(
          Math.pow(element.endX - element.startX, 2) +
            Math.pow(element.endY - element.startY, 2)
        );
        ctx.arc(element.startX, element.startY, radius, 0, 2 * Math.PI);
      } else if (element.type === 'line') {
        ctx.moveTo(element.startX, element.startY);
        ctx.lineTo(element.endX, element.endY);
      }

      ctx.stroke();
    });
  };

  const clearCanvas = () => {
    setElements([]);
    redraw();
  };

  return (
    <div className="flex h-screen bg-blue-950">
      <div className="w-16 border-y-indigo-900 border-r flex flex-col items-center py-4 gap-2">
        <button
          onClick={() => setTool('pen')}
          className={`w-10 h-10 rounded border-2 flex items-center justify-center ${
            tool === 'pen' ? 'bg-blue-500 text-black border-blue-500' : 'border-gray-300'
          }`}
        >
          ✏️
        </button>
        <button
          onClick={() => setTool('rectangle')}
          className={`w-10 h-10 rounded border-2 flex items-center justify-center ${
            tool === 'rectangle' ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
          }`}
        >
          ⬜
        </button>
        <button
          onClick={() => setTool('circle')}
          className={`w-10 h-10 rounded border-2 flex items-center justify-center ${
            tool === 'circle' ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
          }`}
        >
          ⭕
        </button>
        <button
          onClick={() => setTool('line')}
          className={`w-10 h-10 rounded border-2 flex items-center justify-center ${
            tool === 'line' ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
          }`}
        >
          📏
        </button>
        <div className="border-t border-gray-300 w-8 my-2"></div>
        <button
          onClick={clearCanvas}
          className="w-10 h-10 rounded border-2 border-gray-300 flex items-center justify-center hover:bg-red-50"
        >
          🗑️
        </button>
      </div>

      <div className="flex-1 p-4">
        <div className="w-full h-full bg-slate-950 rounded border shadow-sm">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
};

export default Board;
