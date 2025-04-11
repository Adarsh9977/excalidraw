
import { Game } from "@/app/draw/Game";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Users } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import DraggableSettingsPanel from "./DraggablePanel";
import DraggableShapeToolbar from "./DraggableShapeToolbar";

interface RoomUser {
    id: string;
    name: string | null;
}

export function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket}) {
    const { theme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [color, setColor] = useState<string>('#dc143c');
    const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
    const { userId } = useAuth();

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.type === 'room-users') {
                setRoomUsers(data.users);
            }
        };

        socket.addEventListener('message', handleMessage);
        return () => socket.removeEventListener('message', handleMessage);
    }, [socket]);

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
            <div className="fixed top-3 right-4 p-2 z-50">
                <Popover>
                    <PopoverTrigger>
                        <div className="relative">
                            <Button asChild variant='ghost'>
                                <div className="relative">
                                    <Users className="h-4 w-4"/>
                                    <span className="absolute -top-2 -right-2 text-primary rounded-full bg-green-400/60 backdrop-blur-xl w-5 h-5 text-xs flex items-center justify-center">
                                        {roomUsers.length}
                                    </span>
                                </div>
                            </Button>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-48">
                        <h3 className="font-semibold mb-2 text-sm">Online Users</h3>
                        <ul className="space-y-1">
                            {roomUsers.map(user => (
                                <li key={user.id} className="text-sm flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"/>
                                    {user.name || 'Anonymous'}{user.id === userId && ' (You)'}
                                </li>
                            ))}
                        </ul>
                    </PopoverContent>
                </Popover>
            </div>
            <DraggableShapeToolbar selectedShape={selectedShape} setSelectedShape={setSelectedShape} />
            {selectedShape && <DraggableSettingsPanel color={color} setColor={setColor} strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} />}
            <canvas
                className={`fixed ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        </div>
    )
}