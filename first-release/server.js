import express from 'express';
import http from 'http';
import createGame from './public/game.js';
import { Server } from "socket.io";


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const game = createGame();
game.start();

game.subscribe((command) => {
    io.emit(command.type, command);
});

// game.addPlayer({playerId: 'player1', playerX: 0, playerY: 0});
// game.addPlayer({playerId: 'player2', playerX: 9, playerY: 9});
// game.addFruit({fruitId: 'fruit1', fruitX: 3, fruitY: 2});
// game.addFruit({fruitId: 'fruit2', fruitX: 4, fruitY: 4});

console.log(game.state);

io.on('connection', (socket) => {
    const playerId = socket.id;

    game.addPlayer({playerId: playerId});

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({playerId: playerId})
    });

    socket.on('move-player', (command) => {
        command.playerId = playerId;
        command.type = 'move-player';

        game.movePlayer(command);
    });
});

server.listen(3000, () => {
    console.log('> Serve listening on port: 3000');
})