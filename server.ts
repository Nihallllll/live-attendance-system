import WebSocket, { WebSocketServer } from "ws";
import express from "express"

const app =express();
const server = app.listen(8000);
const ws = new WebSocketServer({server});

app.post