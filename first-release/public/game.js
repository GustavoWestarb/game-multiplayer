export default function createGame(){

    const state = {
        players : { },
        fruits: { },
        screen: {
            width: 10,
            height: 10
        }
    }

    const observers = [];

    function start(){
        const frequency = 5000;

        setInterval(addFruit, frequency);
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction);
    }

    function notifyAll(command) {
        for (const observerFuntion of observers) {
            observerFuntion(command);
        }
    }

    function addPlayer(command){
        const playerId = command.playerId;
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }

    function removePlayer(command){
        const playerId = command.playerId;

        delete state.players[playerId];

        notifyAll({
            type: 'remove-player',
            playerId: playerId,
        });
    }

    function setState(newState){
        Object.assign(state, newState);
    }

    function addFruit(command){
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000);
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width);
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height);
        
        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }

        notifyAll({
            type: 'add-fruit',
            fruitId: fruitId,
            fruitX: fruitX,
            fruitY: fruitY
        });
    }

    function removeFruit(command){
        const fruitId = command.fruitId;

        delete state.fruits[fruitId];

        notifyAll({
            type: 'remove-fruit',
            fruitId: fruitId,
        });
    }

    function movePlayer(command){
        notifyAll(command);

        const acceptedMovies = {
            ArrowUp(){
                console.log('game.movePlayer().ArrowUp() -> Moving playwr Up');
                if (player.y - 1 >= 0) {
                    player.y = player.y - 1;
                }
            },
            ArrowRight(){
                console.log('game.movePlayer().ArrowRight() -> Moving playwr Right');
                if (player.x + 1 < state.screen.width) {
                   player.x = player.x + 1;
                }
            },
            ArrowLeft(){
                console.log('game.movePlayer().ArrowLeft() ->  Moving playwr Left');
                if (player.x - 1 >= 0) {
                    player.x = player.x - 1;
                }
            },
            ArrowDown(){
                console.log('game.movePlayer().ArrowDown() -> Moving playwr Down');
                if (player.y + 1 < state.screen.height) {
                    player.y = player.y + 1;
                }
            },
        }

        const keyPressed = command.keyPressed;
        const playerId = command.playerId;
        const player = state.players[command.playerId];
        const moveFuntion = acceptedMovies[keyPressed];

        if (player && moveFuntion) {
            moveFuntion(player);
            checkForFruitCollision(playerId);
        }

        function checkForFruitCollision(playerId){
            const player = state.players[playerId];

            for (const fruitId in state.fruits) {
                const fruit = state.fruits[fruitId];
                console.log(`Checking ${playerId} and ${fruitId}`);

                if (player.x === fruit.x && player.y === fruit.y) {
                    console.log(`Collision between ${playerId} and ${fruitId}`);

                    removeFruit({fruitId: fruitId})
                }
            }
        }

        return;
    }

    return{
        start,
        addPlayer,
        removePlayer,
        addFruit,
        removePlayer,
        movePlayer,
        setState,
        subscribe,
        state
    }
}