
import { Game } from "@/app/draw/Game";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import IconButton from "./icon-button";
import { Circle, RectangleHorizontal, Triangle } from "lucide-react";

export function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket}) {
    const { theme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedShape, setSelectedShape] = useState<'circle' |'rectangle' | 'triangle' | null>(null);

    useEffect(() => {
        if(selectedShape)
        game?.setSelectedShape(selectedShape);
}, [selectedShape, game]);

    useEffect(() => {
        if(canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket, theme);
            setGame(g);

            return () => {
                g?.destroy();
                game?.destroy();
            };
        }
    }, [canvasRef, theme]);

    return (
        <div className="h-[100vh] w-[100vw] overflow-hidden">
            <div className="fixed top-10 left-10 p-4 z-50">
                <div className="flex gap-4">
                    <IconButton selectedShape={selectedShape === 'circle'} onClick={() => setSelectedShape('circle')} icon={<Circle/>}></IconButton>
                    <IconButton selectedShape={selectedShape === 'rectangle'} onClick={() => setSelectedShape('rectangle')} icon={<RectangleHorizontal/>}></IconButton>
                    <IconButton selectedShape={selectedShape === 'triangle'} onClick={() => setSelectedShape('triangle')} icon={<Triangle/>}></IconButton>
                </div>
            </div>
            <canvas className="fixed" ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        </div>
    )
}