import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

let currentPage = 1;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.emit('page-update', currentPage);

    socket.on('change-page', (page) => {
        currentPage = page;
        io.emit('page-update', page);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(process.env.PORT, () => {
    console.log('Server is running on', process.env.PORT, 'port in', process.env.MODE, 'mode');
});
