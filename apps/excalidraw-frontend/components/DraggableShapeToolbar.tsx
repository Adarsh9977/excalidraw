import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Circle, RectangleHorizontal, Triangle, Pencil, Eraser, ArrowDownRight } from "lucide-react";
import IconButton from "./icon-button";

export default function DraggableShapeToolbar({
  selectedShape,
  setSelectedShape,
}: {
  selectedShape: string | null;
  setSelectedShape: Dispatch<SetStateAction<string | null>>;
}) {
  const [position, setPosition] = useState({ x: window.innerWidth/2.5, y: 20 });
  const dragRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging.current) {
        setPosition({
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y,
        });
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    const rect = dragRef.current?.getBoundingClientRect();
    if (rect) {
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  return (
    <div
      ref={dragRef}
      onPointerDown={handlePointerDown}
      className="fixed z-1 cursor-move"
      style={{ top: position.y, left: position.x }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 bg-primary/20 backdrop-blur-xl p-2 rounded-lg shadow-lg z-10000">
          <IconButton
            selectedShape={selectedShape === "circle"}
            onClick={() => setSelectedShape("circle")}
            icon={<Circle />}
          />
          <IconButton
            selectedShape={selectedShape === "rectangle"}
            onClick={() => setSelectedShape("rectangle")}
            icon={<RectangleHorizontal />}
          />
          <IconButton
            selectedShape={selectedShape === "triangle"}
            onClick={() => setSelectedShape("triangle")}
            icon={<Triangle />}
          />
          <IconButton
            selectedShape={selectedShape === "pencil"}
            onClick={() => setSelectedShape("pencil")}
            icon={<Pencil />}
          />
          <IconButton
            selectedShape={selectedShape === "arrow"}
            onClick={() => setSelectedShape("arrow")}
            icon={<ArrowDownRight />}
          />
          <IconButton
            selectedShape={selectedShape === "eraser"}
            onClick={() => setSelectedShape("eraser")}
            icon={<Eraser />}
          />
        </div>
      </div>
    </div>
  );
}
