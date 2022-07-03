export default function createKeyboardListner(document){

    const state = {
        observers: [],
        playerId: null
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction);
    }

    function notifyAll(command) {
        console.log(`keyboarListner -> Notifying ${state.observers.length} observers`);
        
        for (const observerFuntion of state.observers) {
            observerFuntion(command);
        }
    }

    function registerPlayerId(playerId){
        state.playerId = playerId;
    }

    document.addEventListener('keydown', handleKeydown);

    function handleKeydown(event) {
        const keyPressed = event.key;
        
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        }

        notifyAll(command);
    }

    return {
        subscribe,
        registerPlayerId
    }
}