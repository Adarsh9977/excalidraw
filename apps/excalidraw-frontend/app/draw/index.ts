// import axios from "axios";

// type Shape = {
//     type: 'rect';
//     x: number;
//     y: number;
//     width: number;
//     height: number;
// } | {
//     type: 'circle';
//     centerX: number;
//     centerY: number;
//     radius: number;
// } | {
//     type: 'triangle';
//     x1: number;
//     y1: number;
//     x2: number;
//     y2: number;
//     x3: number;
//     y3: number;
// }

// let selectedShape: 'circle' | 'rectangle' | 'triangle' = 'circle';



// export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, theme: string | undefined){
//     const ctx = canvas.getContext("2d");
//     let existingShapes : Shape[]  = await getExistingShapes(roomId);

//     if(!ctx) {
//         return;
//     }

//     socket.onmessage = (event) => {
//         const message = JSON.parse(event.data);
//         if(message.type === 'chat'){
//             const messageData = JSON.parse(message.message);
//             existingShapes.push(messageData);
//             clearCanvas(existingShapes, ctx, canvas, theme);
//         }
//     }

//     clearCanvas(existingShapes, ctx, canvas, theme);
//     let clicked = false;
//     let startX = 0;
//     let startY = 0;

//     canvas.addEventListener("mousedown", (e) => {
//         clicked = true;
//         startX = e.clientX;
//         startY = e.clientY;
//     });

//     canvas.addEventListener("mouseup", (e) => {
//         clicked = false;
//         const currentX = e.clientX;
//         const currentY = e.clientY;

//         let shape: Shape;
//         if (selectedShape === 'rectangle') {
//             shape = {
//                 type: 'rect',
//                 x: startX,
//                 y: startY,
//                 width: currentX - startX,
//                 height: currentY - startY,
//             };
//         } else if (selectedShape === 'circle') {
//             const radius = Math.sqrt(
//                 Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
//             ) / 2;
//             const centerX = startX + (currentX - startX) / 2;
//             const centerY = startY + (currentY - startY) / 2;
//             shape = {
//                 type: 'circle',
//                 centerX,
//                 centerY,
//                 radius,
//             };
//         } else {
//             // Triangle: use start point as first vertex, current point as second vertex,
//             // and reflect the second vertex around the midpoint for the third vertex
//             const midX = (startX + currentX) / 2;
//             const midY = (startY + currentY) / 2;
//             const thirdX = midX + (midY - startY);
//             const thirdY = midY - (midX - startX);
//             shape = {
//                 type: 'triangle',
//                 x1: startX,
//                 y1: startY,
//                 x2: currentX,
//                 y2: currentY,
//                 x3: thirdX,
//                 y3: thirdY
//             };
//         }

//         existingShapes.push(shape);
//         socket.send(JSON.stringify({
//             type: 'chat',
//             message: JSON.stringify(shape),
//             roomId
//         }));
//     });

//     canvas.addEventListener("mousemove", (e) => {
//         if(clicked) {
//             const currentX = e.clientX;
//             const currentY = e.clientY;

//             clearCanvas(existingShapes, ctx, canvas, theme);
//             ctx.strokeStyle = 'crimson';

//             if (selectedShape === 'rectangle') {
//                 const width = currentX - startX;
//                 const height = currentY - startY;
//                 ctx.strokeRect(startX, startY, width, height);
//             } else if (selectedShape === 'circle') {
//                 const radius = Math.sqrt(
//                     Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
//                 ) / 2;
//                 const centerX = startX + (currentX - startX) / 2;
//                 const centerY = startY + (currentY - startY) / 2;
//                 ctx.beginPath();
//                 ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
//                 ctx.stroke();
//             } else {
//                 const midX = (startX + currentX) / 2;
//                 const midY = (startY + currentY) / 2;
//                 const thirdX = midX + (midY - startY);
//                 const thirdY = midY - (midX - startX);
                
//                 ctx.beginPath();
//                 ctx.moveTo(startX, startY);
//                 ctx.lineTo(currentX, currentY);
//                 ctx.lineTo(thirdX, thirdY);
//                 ctx.closePath();
//                 ctx.stroke();
//             }
//         }
//     });
// }

// function clearCanvas(existingShapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme : string | undefined){
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = theme === undefined ? 'white' : theme === 'dark' ? 'black' : 'white';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     existingShapes.map((shape) => {
//         ctx.strokeStyle = "crimson";
//         if(shape.type === 'rect'){
//             ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
//         } else if(shape.type === 'circle'){
//             ctx.beginPath();
//             ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
//             ctx.stroke();
//         } else if(shape.type === 'triangle'){
//             ctx.beginPath();
//             ctx.moveTo(shape.x1, shape.y1);
//             ctx.lineTo(shape.x2, shape.y2);
//             ctx.lineTo(shape.x3, shape.y3);
//             ctx.closePath();
//             ctx.stroke();
//         }
//     });
// }

// async function getExistingShapes(roomId: string){
//     const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
//     const messages = res.data.chats;

//     if(!messages) {
//         return [];
//     }

//     const shapes = messages.map((x: { message: string }) => {
//         const messageData = JSON.parse(x.message);
//             return messageData;
//     });

//     return shapes;
// }