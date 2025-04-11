import React, { useRef, useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";

export default function DraggableSettingsPanel({ color, setColor, strokeWidth, setStrokeWidth }: any) {
  const [position, setPosition] = useState({ x: 10, y: 200 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={panelRef}
      onMouseDown={handleMouseDown}
      className="px-1 z-50 cursor-move"
      style={{ position: 'fixed', top: position.y, left: position.x }}
    >
      <div className="flex flex-col h-60 gap-4 bg-primary/20 backdrop-blur-xl p-2 rounded-lg shadow-lg">
        <div className="grid cursor-pointer grid-cols-2 gap-4 bg-transparent backdrop-blur-sm p-2 rounded-lg shadow-lg">
          {[
            '#99ffcc',
            '#b380ff',
            '#994d00',
            '#ffff1a',
            '#0066ff'
          ].map((c) => (
            <div key={c} className="w-8 h-8 rounded-md flex items-center justify-center">
              <div
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded cursor-pointer ${color === c ? 'border-2 border-black' : ''}`}
                style={{ backgroundColor: c }}
              />
            </div>
          ))}
          <div>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-8 cursor-pointer"
            />
          </div>
        </div>
        <div className="px-2">
          <Slider
            className="h-1 w-full cursor-pointer bg-gradient-to-r from-[1px] via-gray-500 to-[25px]"
            value={[strokeWidth]}
            onValueChange={([value]: number[]) => setStrokeWidth(value)}
            min={1}
            max={25}
            step={1}
          />
        </div>
      </div>
    </div>
  );
}
