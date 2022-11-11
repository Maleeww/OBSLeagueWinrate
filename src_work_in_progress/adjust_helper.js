var fetch = require('node-fetch')

var dictId = new Object();
dictId["NSX"] = "Nissaxter";

var dictCola = new Object();
dictCola["Nissaxter"] = [];
// 1 = sumar 1 victoria
// -1 = sumar 1 derrota
// 77 = reset a 0




/*
Ejemplo código:
while(!isQueueEmpty("Nissaxter")) //si no está vacía
{
    consume("Nissaxter") //cuando esté vacía dejará de ejecutarse el bucle
}

*/

function isQueueEmpty(nombre){
    return !Object.entries(dictCola[nombre]).length>0;
}

function consume(nombre){
    let action = dictCola[nombre].shift()
    return action;
}

function win(id) {
    let user = dictId[id]
    dictCola[user].push(+1);
}

function lose(id) {
    let user = dictId[id]
    dictCola[user].push(-1);
}

function reset(id){
    let user = dictId[id]
    dictCola[user].push(77); //machaca la cola
}


exports.getLastGameId = getLastGameId;

exports.apiInit = apiInit;
exports.apiCheckLastResult = apiCheckLastResult;
exports.setApiKey = setApiKey;
exports.setSummonerName = setSummonerName;
exports.setRegion = setRegion;