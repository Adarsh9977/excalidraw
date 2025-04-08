import { useState, useEffect } from "react";
import { WS_URL } from "../config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZTVkY2VmNS1kMDJmLTQ1MjQtYjA5YS1iOGE5MmNhZTkwZTciLCJpYXQiOjE3NDI2MzYyMTZ9.0Cax0lYecDXEZX6TWpRqa-3KtJxEDpSHHUII9JDlOPg
`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        };
    }, []);

    return {
        loading,
        socket,
    };
}
