import { color } from "framer-motion";
import { getExistingShapes } from "./http";

type Shape = {
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
    strokeWidth?: number;
} | {
    type: 'circle';
    centerX: number;
    centerY: number;
    radius: number;
    color?: string;
    strokeWidth?: number;
} | {
    type: 'triangle';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
    color?: string;
    strokeWidth?: number;
} | {
    type: 'pencil';
    points: { x: number; y: number }[];
    color?: string;
    strokeWidth?: number;
} | {
    type: 'text';
    text: string;
    textX: number;
    textY: number;
    fontSize: number;
    color?: string;
    strokeWidth?: number;
} | {
    type: 'eraser';
    points: { x: number; y: number }[];
    strokeWidth?: number;
    color?: string;
};

export class Game {
    private canvas: HTMLCanvasElement;
    private roomId: string;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[] = [];
    private socket: WebSocket;
    private startX : number;
    private startY : number;
    private clicked: boolean;
    private selectedShape: 'circle' | 'rectangle' | 'triangle' | 'pencil' | 'text' | 'eraser' = 'circle';
    private currentPath: {x: number, y: number}[] = [];
    private currentColor: string = 'crimson';
    private currentStrokeWidth: number = 2;
    private fontSize: number = 16;
    private theme: string | undefined;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket : WebSocket, theme: string | undefined) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.roomId = roomId;
        this.socket = socket;
        this.theme = theme;
        this.startX = 0;
        this.startY = 0;
        this.clicked = false;
        this.currentPath = [{x: 0, y: 0}];
        this.currentColor = 'crimson';
        this.currentStrokeWidth = 2;
        this.fontSize = 16;
        this.init();
        this.initHandler();
        this.initMouseHandles();
        this.setColor('crimson');
        this.setStrokeWidth(2);
        this.selectedShape = 'circle';
        
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    setSelectedShape(shape: 'circle' | 'rectangle' | 'triangle' | 'pencil' | 'text') {
        this.selectedShape = shape;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    initHandler() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if(message.type === 'chat'){
                const messageData = JSON.parse(message.message);
                this.existingShapes.push(messageData);
                this.clearCanvas();
            }
        }
    }

    clearCanvas(){
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.theme === undefined ? 'white' : this.theme === 'dark' ? 'black' : 'white';
        this.ctx?.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.map((shape) => {
            if (shape?.type === 'eraser' && shape.points) {
                this.ctx.globalCompositeOperation = 'destination-out';
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.theme === undefined ? 'white' : this.theme === 'dark' ? 'black' : 'white';;
                this.ctx.lineWidth = shape.strokeWidth || 20;
                this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
                shape.points.forEach(point => {
                this.ctx.lineTo(point.x, point.y);
                });
                this.ctx.stroke();
                this.ctx.globalCompositeOperation = 'source-over';
            } else {
                this.ctx.lineWidth = shape?.strokeWidth || 2;

                if (shape?.type === 'pencil' && shape.points) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = shape.color || 'crimson';
                    this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    shape.points.forEach(point => {
                        this.ctx.lineTo(point.x, point.y);
                    });
                    this.ctx.stroke();
                } else if (shape?.type === 'text' && shape.text) {
                    this.ctx.font = `${shape.fontSize}px Arial`;
                    this.ctx.fillStyle = shape.color || 'crimson';
                    this.ctx.fillText(shape.text, shape.textX!, shape.textY!);
                } else {
                    if(shape?.type === 'rect'){
                        this.ctx.strokeStyle = shape.color || 'crimson';
                        this.ctx?.strokeRect(shape.x, shape.y, shape.width, shape.height);
                    } else if(shape?.type === 'circle'){
                        this.ctx?.beginPath();
                        this.ctx.strokeStyle = shape.color || 'crimson';
                        this.ctx.lineWidth = shape.strokeWidth || 2;
                        this.ctx?.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
                        this.ctx?.stroke();
                    } else if(shape?.type === 'triangle'){
                        this.ctx?.beginPath();
                        this.ctx.strokeStyle = shape.color || 'crimson';
                        this.ctx.lineWidth = shape.strokeWidth || 2;
                        this.ctx?.moveTo(shape.x1, shape.y1);
                        this.ctx?.lineTo(shape.x2, shape.y2);
                        this.ctx?.lineTo(shape.x3, shape.y3);
                        this.ctx?.closePath();
                        this.ctx?.stroke();
                    }
                }
            }
        });
    }

    mouseUpHandler = (e: MouseEvent)=> {
        this.clicked = false;
        const currentX = e.clientX;
        const currentY = e.clientY;

        let shape: Shape | null = null;
        if (this.selectedShape === 'rectangle') {
            shape = {
                type: 'rect',
                x: this.startX,
                y: this.startY,
                width: currentX - this.startX,
                height: currentY - this.startY,
                strokeWidth: this.currentStrokeWidth,
                color: this.currentColor
            };
        } else if (this.selectedShape === 'circle') {
            const radius = Math.sqrt(
                Math.pow(currentX - this.startX, 2) + Math.pow(currentY - this.startY, 2)
            ) / 2;
            const centerX = this.startX + (currentX - this.startX) / 2;
            const centerY = this.startY + (currentY - this.startY) / 2;
            shape = {
                type: 'circle',
                centerX,
                centerY,
                radius,
                strokeWidth: this.currentStrokeWidth,
                color: this.currentColor
            };
        } else if (this.selectedShape === 'triangle') {
            const midX = (this.startX + currentX) / 2;
            const midY = (this.startY + currentY) / 2;
            const thirdX = midX + (midY - this.startY);
            const thirdY = midY - (midX - this.startX);
            shape = {
                type: 'triangle',
                x1: this.startX,
                y1: this.startY,
                x2: currentX,
                y2: currentY,
                x3: thirdX,
                y3: thirdY,
                strokeWidth: this.currentStrokeWidth,
                color: this.currentColor
            };
        }else if (this.selectedShape === 'pencil') {
            const point = { x: e.clientX, y: e.clientY };
            this.currentPath.push(point);
            shape = {
                type: 'pencil',
                points: this.currentPath,
                strokeWidth: this.currentStrokeWidth,
                color: this.currentColor
            };
        }else if (this.selectedShape === 'text') {
            const text = prompt('Enter text:');
            if (text) {
                const shape = {
                    type: 'text',
                    text,
                    textX: this.startX,
                    textY: this.startY,
                    fontSize: this.fontSize,
                    color: this.currentColor,
                    strokeWidth: this.currentStrokeWidth
                };
                this.existingShapes.push(shape as Shape);
                this.socket.send(JSON.stringify({
                    type: 'chat',
                    message: JSON.stringify(shape),
                    roomId: this.roomId
                }));
                this.clearCanvas();
            }
        }else if(this.selectedShape === 'eraser'){
            const point = { x: e.clientX, y: e.clientY };
            this.currentPath.push(point);
            shape = {
                type: "eraser",
                points: this.currentPath,
                strokeWidth: this.currentStrokeWidth * 2.5,
                color: this.theme === undefined ? 'white' : this.theme === 'dark' ? 'black' : 'white',
            };
        }


        if(!shape) {
            return;
        }
        if (shape) {
            this.existingShapes.push(shape);

            this.socket.send(JSON.stringify({
                type: 'chat',
                message: JSON.stringify({
                    shape
                }),
                roomId: this.roomId
            }));
        }
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        if (this.selectedShape === 'pencil') {
            this.clicked = true;
            this.currentPath = [{ x: this.startX, y: this.startY }];
        } else if (this.selectedShape === 'text') {
            const text = prompt('Enter text:');
            if (text) {
                const shape = {
                    type: 'text',
                    text,
                    textX: this.startX,
                    textY: this.startY,
                    fontSize: this.fontSize,
                    color: this.currentColor,
                    strokeWidth: this.currentStrokeWidth
                };
                this.existingShapes.push(shape as Shape);
                this.socket.send(JSON.stringify({
                    type: 'chat',
                    message: JSON.stringify(shape),
                    roomId: this.roomId
                }));
                this.clearCanvas();
            }
        }else if(this.selectedShape === 'eraser'){
            this.clicked = true;
            this.currentPath = [{ x: this.startX, y: this.startY }];
        }
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const currentX = e.clientX;
            const currentY = e.clientY;

            this.clearCanvas();
            const selectedShape = this.selectedShape;
            console.log("SELECTED SHAPE", selectedShape);

            if (selectedShape === 'rectangle') {
                const width = currentX - this.startX;
                const height = currentY - this.startY;
                this.ctx.strokeStyle = this.currentColor;
                this.ctx.lineWidth = this.currentStrokeWidth;
                this.ctx.strokeRect(this.startX, this.startY, width, height);

            } else if (selectedShape === 'circle') {
                const radius = Math.sqrt(
                    Math.pow(currentX - this.startX, 2) + Math.pow(currentY - this.startY, 2)
                ) / 2;
                const centerX = this.startX + (currentX - this.startX) / 2;
                const centerY = this.startY + (currentY - this.startY) / 2;
                this.ctx.beginPath();
                this.ctx.lineWidth = this.currentStrokeWidth;
                this.ctx.strokeStyle = this.currentColor;
                this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                this.ctx.stroke();
            }else if(selectedShape === 'pencil'){
                const point = { x: e.clientX, y: e.clientY };
                this.currentPath.push(point);
    
                this.clearCanvas();
                this.ctx.beginPath();
                this.ctx.lineWidth = this.currentStrokeWidth;
                this.ctx.strokeStyle = this.currentColor;
                this.ctx.moveTo(this.currentPath[0].x, this.currentPath[0].y);
                this.currentPath.forEach(point => {
                    this.ctx.lineTo(point.x, point.y);
                });
                this.ctx.stroke();
            }else if(selectedShape === 'triangle'){
                const midX = (this.startX + currentX) / 2;
                const midY = (this.startY + currentY) / 2;
                const thirdX = midX + (midY - this.startY);
                const thirdY = midY - (midX - this.startX);

                this.ctx.beginPath();
                this.ctx.strokeStyle = this.currentColor;
                this.ctx.lineWidth = this.currentStrokeWidth;
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(currentX, currentY);
                this.ctx.lineTo(thirdX, thirdY);
                this.ctx.closePath();
                this.ctx.stroke();
            }else if(selectedShape === 'eraser'){
                const point = { x: e.clientX, y: e.clientY };
                this.currentPath.push(point);

                this.clearCanvas();

                // Eraser effect first
                this.ctx.globalCompositeOperation = 'destination-out';
                this.ctx.beginPath();
                this.ctx.lineWidth = this.currentStrokeWidth * 2;
                this.ctx.moveTo(this.currentPath[0].x, this.currentPath[0].y);
                this.currentPath.forEach(point => {
                    this.ctx.lineTo(point.x, point.y);
                });
                this.ctx.stroke();
                this.ctx.globalCompositeOperation = 'source-over';
                
                // Draw cursor on top
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(e.clientX, e.clientY, this.currentStrokeWidth, 0, Math.PI * 2);
                this.ctx.strokeStyle = this.theme === 'dark' ? 'white' : 'black';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                this.ctx.fill();
                this.ctx.restore();
            }
        }
    }

    initMouseHandles(){
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);

        this.canvas.addEventListener("mouseup", this.mouseUpHandler);

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    
    }

    setColor(color: string) {
        this.currentColor = color;
    }

    setStrokeWidth(width: number) {
        this.currentStrokeWidth = width;
    }

    setFontSize(size: number) {
        this.fontSize = size;
    }

}
