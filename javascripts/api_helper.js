var api = require('./api.js') //js?
var fetch = require('node-fetch')

// lose = 0
// win = 1
var apiKey = api.getApiKey();
//var lastGameIsWin = 1;
var aux = 1;
var region = "euw1";
const baseUrl = "https://" + region + ".api.riotgames.com";
var summoner;
var summonerName = "Grekkø" //"Grekkø";
var puuid;
//var puuid = "rfxaAA6AhqREAroXvZl3rP5i5_Mzuu5u6EkLYQxBPTE0MtPzhS0MhzmtAG0yxNcs7zwCbwCTFgiYVw";

function setRegion(newRegion) {
    region = newRegion;
    baseUrl = "https://" + newRegion + ".api.riotgames.com";
}

function setSummonerName(newName) {
    summonerName = newName;
    console.log("Summoner set to: " + newName)
    setSummoner();
}

function setApiKey(newKey) {
    apiKey = newKey;
    console.log("Api key set to: " + apiKey)
}

async function setSummoner() {
    var requestUrl = baseUrl + "/lol/summoner/v4/summoners/by-name/" + summonerName + "?api_key=" + apiKey;
    const response = await fetch(requestUrl, { mode: 'cors' });
    summoner = await response.json(); //extract JSON from the http response
    puuid = summoner["puuid"]
}

async function getLastGameId() {

    var requestUrl = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?start=0&count=1&api_key=" + apiKey;
    const response = await fetch(requestUrl, { mode: 'cors' });
    var gameId = await response.json(); //extract JSON from the http response
    return gameId;
    //var summonerName = "Grekkø"
    // https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/Grekk%C3%B8
    // /lol/summoner/v4/summoners/by-name/{summonerName}
}



async function apiCheckLastResult() {
    var gameId = await getLastGameId();

    var found = false;
    var requestUrl = "https://europe.api.riotgames.com/lol/match/v5/matches/" + gameId + "?api_key=" + apiKey;
    var respuesta;
    while (!found)
        //const response = await fetch(requestUrl, { mode: 'cors' });
        await fetch(requestUrl, { mode: 'cors' }).then(response => {
            if (response.ok) {
                respuesta = response;
                found = true;
            } else if (response.status == 404) found = false;
        }).catch(error => console.log("Error al buscar"))

    var match = await respuesta.json(); //extract JSON from the http response

    var players = match["info"]["participants"]
    //console.log(players)
    var playerResult;
    for (var p of players) {
        if (p["puuid"] == puuid) {
            console.log(p["summonerName"] + " victory is: " + p["win"])
            if (p["win"]) return '1'; 
            else return '0';
        }
    }
    throw 'Error al buscar en la última partida';


}

function apiInit(summ) {
    //var requestUrl = baseUrl + "/lol/summoner/v4/summoners/by-name/" + summonerName;
    //summoner = requestUrl;
    setSummonerName(summ);
}


exports.getLastGameId = getLastGameId;

exports.apiInit = apiInit;
exports.apiCheckLastResult = apiCheckLastResult;
exports.setApiKey = setApiKey;
exports.setSummonerName = setSummonerName;
exports.setRegion = setRegion;
