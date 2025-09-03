import react from 'react'
import { Pen, Eraser, Ruler, Square, Circle, TextCursor, ArrowRightCircle } from 'lucide-react';
import { useState } from 'react';

function Toolbar( { tool, setTool, color, setColor, thickness, setThickness, clearBoard, roomId }) {
    {/* Professional Photoshop-Style Toolbar */}
const toolConfig = {
  pen: { icon: "✏️", label: "Pen" },
  text: { icon: "📝", label: "Text" },
  line: { icon: "📏", label: "Line" },
  rectangle: { icon: "⬛", label: "Rectangle" },
  circle: { icon: "⭕", label: "Circle" }
};


    return(


        
<div className="w-25 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-600 shadow-2xl flex flex-col">
  {/* Header Section */}
  <div className="p-3 border-b border-gray-600 bg-gray-750">
    <div className="w-10 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center mb-2">
      <span className="text-white text-xs font-bold">WS</span>
    </div>
    <div className="text-xs text-gray-400 truncate">
      #{roomId?.slice(-6)}
    </div>
  </div>

  {/* Drawing Tools Group */}
  <div className="flex-1 p-2 space-y-1">
    <div className="text-xs text-gray-400 mb-2 px-1">TOOLS</div>
    
    {Object.entries(toolConfig).map(([t, config]) => (
      <button
        key={t}
        onClick={() => {
          setTool(t);
          console.log("Tool selected:", t); // Debug log
        }}
        className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center text-sm transition-all duration-200 group relative ${
          tool === t 
            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
            : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
        }`}
        title={config.label}
      >
        <span className="text-lg mb-1">{config.icon}</span>
        <span className="text-xs font-medium">{config.label.slice(0,3)}</span>
        
        {/* Active indicator */}
        {tool === t && (
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-full"></div>
        )}
        
        {/* Tooltip */}
        <div className="absolute left-20 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
          {config.label}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </button>
    ))}

    {/* Separator */}
    <div className="h-px bg-gray-600 my-3 mx-2"></div>

    {/* Color Palette */}
    <div className="space-y-2">
      <div className="text-xs text-gray-400 px-1">COLORS</div>
      <div className="grid grid-cols-2 gap-1">
        {["#FFFFFF", "#FF4444", "#44FF44", "#4444FF", "#FFFF44", "#FF44FF", "#44FFFF", "#000000"].map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-7 h-7 rounded border-2 transition-all duration-200 hover:scale-110 ${
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
    <div className="mt-4">
      <div className="text-xs text-gray-400 mb-2 px-1 uppercase tracking-wide">Brush Settings</div>
      <div className="bg-gray-700/50 rounded-lg p-3 backdrop-blur-sm">
        <div className="flex justify-between items-center ">
          <label className="text-xs text-gray-400">Thickness</label>
          <span className="text-xs  text-white">{thickness}px</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={thickness}
          onChange={(e) => setThickness(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(thickness-1)*11.11}%, #4b5563 ${(thickness-1)*11.11}%, #4b5563 100%)`
          }}
        />
      </div>
    </div>
  </div>

  {/* Bottom Actions */}
  <div className="p-2 border-t border-gray-600 space-y-2">
    {/* Clear Board */}
    <button
      onClick={clearBoard}
      className="w-16 h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/30 flex flex-col items-center justify-center group"
      title="Clear Board"
    >
      <span className="text-lg">🗑️</span>
      <span className="text-xs">Clear</span>
      
      {/* Tooltip */}
      <div className="absolute left-20 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
        Clear Board
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    </button>

    {/* Status Indicators */}
    <div className="border-t border-gray-600 pt-2 space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">Tool:</span>
        <span className="text-white font-medium capitalize">{toolConfig[tool]?.label.slice(0,3)}</span>
      </div>
      <div className="flex items-center justify-center space-x-1 text-xs text-green-400">
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
        <span>Auto-saved</span>
      </div>
    </div>
  </div>
</div>
)}

export default Toolbar