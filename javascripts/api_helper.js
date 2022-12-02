var api = require('./api.js') //js?
var fetch = require('node-fetch')

var dictRegionLocal = new Object();
dictRegionLocal["EUW"] = "euw1";
dictRegionLocal["EUNE"] = "eune1";
dictRegionLocal["LAS"] = "la2"
dictRegionLocal["LAN"] = "la1"
dictRegionLocal["NA"] = "na1"

var dictRegionUniversal = new Object();
dictRegionUniversal["EUW"] = "europe";
dictRegionUniversal["EUNE"] = "europe";
dictRegionUniversal["LAN"] = "americas"
dictRegionUniversal["LAS"] = "americas"
dictRegionUniversal["NA"] = "americas"

// LAN = LA1
// LAS = LA2


var apiKey = api.getApiKey();
var aux = 1;
var region = "euw1";
const baseUrl = "https://" + region + ".api.riotgames.com";
var summoner;
var summonerName = "Grekkø" //"Grekkø";


async function fetchAPI(requestUrl,header){
    try{
        return await fetch(requestUrl,header)
    }
    catch(error){
        console.error(error)
        // Retry
        return await fetchAPI(requestUrl, header)
    }
    
}

function setApiKey(newKey) {
    apiKey = newKey;
    console.log("Api key set to: " + apiKey)
}


async function getLastGameId(puuid, regionVar) {
    //await console.log(puuid);
    // matches by puuid usa universal
    var requestUrl = "https://"+ dictRegionUniversal[regionVar] +".api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?start=0&count=1&api_key=" + apiKey;
    const response = await fetchAPI(requestUrl, { mode: 'cors' });
    var gameId = await response.json(); //extract JSON from the http response
    return gameId;
    //var summonerName = "Grekkø"
    // https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/Grekk%C3%B8
    // /lol/summoner/v4/summoners/by-name/{summonerName}
}



async function apiCheckLastResult(puuid, regionVar) {
    var gameId = await getLastGameId(puuid, regionVar);

    var found = false;
    // Match by gameid usa universal
    var requestUrl = "https://"+ dictRegionUniversal[regionVar] +".api.riotgames.com/lol/match/v5/matches/" + gameId + "?api_key=" + apiKey;
    var respuesta;
    while (!found)
        //const response = await fetch(requestUrl, { mode: 'cors' });
        await fetchAPI(requestUrl, { mode: 'cors' }).then(response => {
            if (response.ok) {
                respuesta = response;
                found = true;
            } else if (response.status == 404) found = false;
        }).catch(error => {console.log("Error al buscar"); console.error(error)})

    var match = await respuesta.json(); //extract JSON from the http response
    let timeDuration = match["info"]["gameDuration"]
    var players = match["info"]["participants"]
    //console.log(players)
    var playerResult;
    if(timeDuration > 240){
    for (var p of players) {
        if (p["puuid"] == puuid) {
            console.log(p["summonerName"] + " victory is: " + p["win"])
            if (p["win"]) return '1'; 
            else return '0';
        }
    }
    throw 'Error al buscar en la última partida';
}
//Si no es mayor de 240 (4 minutos)
else {
    console.log("Game was remade with "+timeDuration+" seconds")
    return timeDuration;
}
}

async function isPlayingBySummonerName(summ){
    // cloud nine
    let id = getEncryptedId(summ);
    return isPlayingById(id);
}

async function isPlayingById(id, regionVar){
    // cloud nine
    var requestUrl = "https://" + dictRegionLocal[regionVar] + ".api.riotgames.com" + "/lol/spectator/v4/active-games/by-summoner/" + id + "?api_key=" + apiKey;
    const response = await fetch(requestUrl, { mode: 'cors' });
    console.log('Status: '+response.status)
    let status = await response.status; //extract JSON from the http response
    //https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/tRk13snzDy0HyHKUM4XFad8GcrqtKuA4WHNbpYbMiE2BqZQ?api_key=RGAPI-1f15d384-3646-4af8-8089-ff66cf5c8675
    if(status==200) return '1';
    else return '0';

}

async function getPuuid(summ, regionVar){
    // GetPuuid usa local
    var requestUrl = "https://" + dictRegionLocal[regionVar] + ".api.riotgames.com" + "/lol/summoner/v4/summoners/by-name/" + summ + "?api_key=" + apiKey;
    const response = await fetch(requestUrl, { mode: 'cors' });
    summoner = await response.json(); //extract JSON from the http response
    console.log('Level: '+summoner["summonerLevel"])
    return summoner["puuid"];

}

async function getEncryptedId(summ, regionVar){
    // GetPuuid usa local
    var requestUrl = "https://" + dictRegionLocal[regionVar] + ".api.riotgames.com" + "/lol/summoner/v4/summoners/by-name/" + summ + "?api_key=" + apiKey;
    const response = await fetch(requestUrl, { mode: 'cors' });
    summoner = await response.json(); //extract JSON from the http response
    console.log('Id: '+summoner["id"])
    return summoner["id"];

}

function apiInit(summ, regionVar) {
    //var requestUrl = baseUrl + "/lol/summoner/v4/summoners/by-name/" + summonerName;
    //summoner = requestUrl;
    //setSummonerName(summ);
    return getPuuid(summ, regionVar);
}


exports.getLastGameId = getLastGameId;

exports.apiInit = apiInit;

exports.getPuuid = getPuuid;

exports.isPlayingById = isPlayingById

exports.getEncryptedId = getEncryptedId;

exports.apiCheckLastResult = apiCheckLastResult;
exports.setApiKey = setApiKey;
