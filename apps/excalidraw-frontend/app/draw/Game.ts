import { color } from "framer-motion";
import { getExistingShapes } from "./http";

type Shape = {
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    color?: string;
    strokeWidth?: number;
} | {
    type: 'circle';
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
    rotation: number;
    startAngle: number;
    endAngle: number;
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
} | {
    type: 'arrow';
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color?: string;
    strokeWidth?: number;
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
    private selectedShape: 'circle' | 'rectangle' | 'triangle' | 'pencil' | 'eraser' | 'arrow' | null = null;
    private currentPath: {x: number, y: number}[] = [];
    private currentColor: string = 'crimson';
    private currentStrokeWidth: number = 2;
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
        this.init();
        this.initHandlers();
        this.initMouseHandles();
        this.setColor('crimson');
        this.setStrokeWidth(2);
        this.selectedShape = null;
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    setSelectedShape(shape: 'circle' | 'rectangle' | 'triangle' | 'pencil' | 'eraser' | 'arrow') {
        this.selectedShape = shape;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);


            if(message.type === 'chat'){
                const messageData = JSON.parse(message.message);
                console.log("existing shapes -1", this.existingShapes);
                this.existingShapes.push(messageData.shape);
                console.log("existing shapes -2", this.existingShapes);
                this.clearCanvas();
            }
        }
    }

    setViewportTransform(panX: number, panY: number, zoom: number) {
        if (!this.ctx) return;
        
        // Reset the current transformation
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        // Clear the canvas with the current theme background
        this.ctx.fillStyle = this.theme === 'dark' ? 'black' : 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply the new transformation
        this.ctx.setTransform(zoom, 0, 0, zoom, panX, panY);
        
        // Redraw all shapes with the new transformation
        this.clearCanvas();
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
                this.ctx.lineWidth = (shape.strokeWidth ? shape.strokeWidth * 1 : 20);
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
                }else {
                    if(shape?.type === 'rect'){
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = shape.color || '#dc143c';
                        this.ctx.lineWidth = shape.strokeWidth || 2;
                        this.ctx.moveTo(shape.x + shape.radius, shape.y);
                        this.ctx.lineTo(shape.x + shape.width - shape.radius, shape.y);
                        this.ctx.quadraticCurveTo(shape.x + shape.width, shape.y, shape.x + shape.width, shape.y + shape.radius);
                        this.ctx.lineTo(shape.x + shape.width, shape.y + shape.height - shape.radius);
                        this.ctx.quadraticCurveTo(shape.x + shape.width, shape.y + shape.height, shape.x + shape.width - shape.radius, shape.y + shape.height);
                        this.ctx.lineTo(shape.x + shape.radius, shape.y + shape.height);
                        this.ctx.quadraticCurveTo(shape.x, shape.y + shape.height, shape.x, shape.y + shape.height - shape.radius);
                        this.ctx.lineTo(shape.x, shape.y + shape.radius);
                        this.ctx.quadraticCurveTo(shape.x, shape.y, shape.x + shape.radius, shape.y);
                        this.ctx.stroke();
                    } else if(shape?.type === 'circle'){
                        this.ctx?.beginPath();
                        this.ctx.strokeStyle = shape.color || 'crimson';
                        this.ctx.lineWidth = shape.strokeWidth || 2;
                        this.ctx?.ellipse(shape.centerX, shape.centerY, shape.radiusX, shape.radiusY, shape.rotation, shape.startAngle, shape.endAngle);
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
                    }else if(shape?.type === 'arrow'){
                        this.ctx?.beginPath();
                        this.ctx.strokeStyle = shape.color || 'crimson';
                        this.ctx.lineWidth = shape.strokeWidth || 2;
                        
                        // Draw the line
                        this.ctx.moveTo(shape.startX, shape.startY);
                        this.ctx.lineTo(shape.endX, shape.endY);
                        this.ctx.stroke();
                        
                        // Draw the arrowhead
                        const angle = Math.atan2(shape.endY - shape.startY, shape.endX - shape.startX);
                        const headLength = 15; // Length of arrow head
                        
                        // Draw the arrowhead lines
                        this.ctx.beginPath();
                        this.ctx.moveTo(shape.endX, shape.endY);
                        this.ctx.lineTo(
                            shape.endX - headLength * Math.cos(angle - Math.PI/6),
                            shape.endY - headLength * Math.sin(angle - Math.PI/6)
                        );
                        this.ctx.moveTo(shape.endX, shape.endY);
                        this.ctx.lineTo(
                            shape.endX - headLength * Math.cos(angle + Math.PI/6),
                            shape.endY - headLength * Math.sin(angle + Math.PI/6)
                        );
                        this.ctx.stroke();
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
            const x = Math.min(this.startX, currentX);
            const y = Math.min(this.startY, currentY);
            const width = Math.abs(currentX - this.startX);
            const height = Math.abs(currentY - this.startY);
            const radius = Math.min(10, width / 2, height / 2);

            shape ={
                type: 'rect',
                x,
                y,
                width,
                height,
                radius,
                strokeWidth: this.currentStrokeWidth,
                color: this.currentColor
            }
        } else if (this.selectedShape === 'circle') {
                const radiusX = Math.abs(currentX - this.startX) / 2;
                const radiusY = Math.abs(currentY - this.startY) / 2;
                const centerX = (this.startX + currentX) / 2;
                const centerY = (this.startY + currentY) / 2;
                const rotation = 0;
                const startAngle = 0;
                const endAngle = 2 * Math.PI;
                shape = {
                    type: 'circle',
                    centerX,
                    centerY,
                    radiusX,
                    radiusY,
                    rotation,
                    startAngle,
                    endAngle,
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
        }else if(this.selectedShape === 'eraser'){
            const point = { x: e.clientX, y: e.clientY };
            this.currentPath.push(point);
            shape = {
                type: "eraser",
                points: this.currentPath,
                strokeWidth: this.currentStrokeWidth * 2.5,
                color: this.theme === undefined ? 'white' : this.theme === 'dark' ? 'black' : 'white',
            };
        }else if (this.selectedShape === 'arrow') {
            shape = {
                type: 'arrow',
                startX: this.startX,
                startY: this.startY,
                endX: currentX,
                endY: currentY,
                strokeWidth: this.currentStrokeWidth,
                color: this.currentColor
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
        } else if(this.selectedShape === 'eraser'){
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
            
            if (selectedShape === 'rectangle') {
                const x = Math.min(this.startX, currentX);
                const y = Math.min(this.startY, currentY);
                const width = Math.abs(currentX - this.startX);
                const height = Math.abs(currentY - this.startY);
                const radius = Math.min(10, width / 2, height / 2);
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.currentColor;
                this.ctx.lineWidth = this.currentStrokeWidth;
                this.ctx.moveTo(x + radius, y);
                this.ctx.lineTo(x + width - radius, y);
                this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.ctx.lineTo(x + width, y + height - radius);
                this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.ctx.lineTo(x + radius, y + height);
                this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.ctx.lineTo(x, y + radius);
                this.ctx.quadraticCurveTo(x, y, x + radius, y);
                this.ctx.stroke();

            } else if (selectedShape === 'circle') {

                this.ctx.beginPath();
                this.ctx.strokeStyle = this.currentColor;
                this.ctx.lineWidth = this.currentStrokeWidth;
                const radiusX = Math.abs(currentX - this.startX) / 2;
                const radiusY = Math.abs(currentY - this.startY) / 2;
                const centerX = (this.startX + currentX) / 2;
                const centerY = (this.startY + currentY) / 2;
                const rotation = 0;
                const startAngle = 0;
                const endAngle = 2 * Math.PI;
                this.ctx.ellipse(centerX, centerY, radiusX, radiusY, rotation, startAngle, endAngle * 2);
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
            }else if(selectedShape === 'arrow'){
                // Draw the line
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.currentColor;
                this.ctx.lineWidth = this.currentStrokeWidth;
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(currentX, currentY);
                this.ctx.stroke();
                
                // Draw the arrowhead
                const angle = Math.atan2(currentY - this.startY, currentX - this.startX);
                const headLength = 15; // Length of arrow head
                
                this.ctx.beginPath();
                this.ctx.moveTo(currentX, currentY);
                this.ctx.lineTo(
                    currentX - headLength * Math.cos(angle - Math.PI/6),
                    currentY - headLength * Math.sin(angle - Math.PI/6)
                );
                this.ctx.moveTo(currentX, currentY);
                this.ctx.lineTo(
                    currentX - headLength * Math.cos(angle + Math.PI/6),
                    currentY - headLength * Math.sin(angle + Math.PI/6)
                );
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

}
