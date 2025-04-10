
import { Game } from "@/app/draw/Game";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import IconButton from "./icon-button";
import { Circle, RectangleHorizontal, Triangle, Pencil, Type, Palette, Eraser } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "@/components/ui/slider";

export function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket}) {
    const { theme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedShape, setSelectedShape] = useState<'circle' | 'rectangle' | 'triangle' | 'pencil' | 'text' | 'eraser' | null>(null);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [color, setColor] = useState('crimson');

    useEffect(() => {
        if(selectedShape && game) {
            game.setSelectedShape(selectedShape as any);
        }
    }, [selectedShape, game]);

    useEffect(() => {
        if (game) {
            game.setColor(color);
        }
    }, [color, game]);

    useEffect(() => {
        if (game) {
            game.setStrokeWidth(strokeWidth);
        }
    }, [strokeWidth, game]);

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
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 bg-background backdrop-blur-sm p-2 rounded-lg shadow-lg">
                        <IconButton 
                            selectedShape={selectedShape === 'circle'} 
                            onClick={() => setSelectedShape('circle')} 
                            icon={<Circle/>}
                        />
                        <IconButton 
                            selectedShape={selectedShape === 'rectangle'} 
                            onClick={() => setSelectedShape('rectangle')} 
                            icon={<RectangleHorizontal/>}
                        />
                        <IconButton 
                            selectedShape={selectedShape === 'triangle'} 
                            onClick={() => setSelectedShape('triangle')} 
                            icon={<Triangle/>}
                        />
                        <IconButton 
                            selectedShape={selectedShape === 'pencil'} 
                            onClick={() => setSelectedShape('pencil')} 
                            icon={<Pencil/>}
                        />
                        <IconButton 
                            selectedShape={selectedShape === 'text'} 
                            onClick={() => setSelectedShape('text')} 
                            icon={<Type/>}
                        />
                        <IconButton 
                            selectedShape={selectedShape === 'eraser'} 
                            onClick={() => setSelectedShape('eraser')} 
                            icon={<Eraser/>}
                        />
                    </div>

                    <div className="flex gap-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
                        <Popover>
                            <PopoverTrigger>
                                <div className="w-8 h-8 rounded-md border border-input flex items-center justify-center">
                                    <div className="w-6 h-6 rounded" style={{ backgroundColor: color }} />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-64">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full h-8"
                                />
                            </PopoverContent>
                        </Popover>

                        <div className="w-32">
                            <Slider
                                value={[strokeWidth]}
                                onValueChange={([value]: number[]) => setStrokeWidth(value)}
                                min={1}
                                max={25}
                                step={1}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <canvas 
                className={`fixed ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
                ref={canvasRef}
                width={window.innerWidth} 
                height={window.innerHeight}
            />
        </div>
    )
}