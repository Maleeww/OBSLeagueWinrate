
// lose = 0
// win = 1
var apiKey = "RGAPI-8c44901a-cc5b-4138-800e-6fd7f2b7ba3b";
//var lastGameIsWin = 1;
var aux = 1;
var region = "euw1";
const baseUrl = "https://" + region + ".api.riotgames.com";
var summoner;
var summonerName = "ZTS TheMalware" //"Grekkø";
//var puuid = "rfxaAA6AhqREAroXvZl3rP5i5_Mzuu5u6EkLYQxBPTE0MtPzhS0MhzmtAG0yxNcs7zwCbwCTFgiYVw";

function setRegion(newRegion) {
    region = newRegion;
    baseUrl = "https://" + newRegion + ".api.riotgames.com";
}

function setSummonerName(newName) {
    summonerName = newName;
    console.log("Summoner set to: "+newName)
    setSummoner();
}

async function setSummoner() {
    var requestUrl = baseUrl + "/lol/summoner/v4/summoners/by-name/" + summonerName + "?api_key=" + apiKey;
    const response = await fetch(requestUrl, { mode: 'cors' });
    summoner = await response.json(); //extract JSON from the http response
    puuid = summoner["puuid"]
    console.log(puuid)
}

async function apiGetLastGameId() {

    var requestUrl = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?start=0&count=1&api_key=" + apiKey;
    const response = await fetch(requestUrl, { mode: 'cors' });
    var gameId = await response.json(); //extract JSON from the http response
    return gameId;
    //var summonerName = "Grekkø"
    // https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/Grekk%C3%B8
    // /lol/summoner/v4/summoners/by-name/{summonerName}
}



async function apiCheckLastResult() {
    var gameId = await apiGetLastGameId();

    var requestUrl = "https://europe.api.riotgames.com/lol/match/v5/matches/" + gameId + "?api_key=" + apiKey;
    const response = await fetch(requestUrl, { mode: 'cors' });
    var match = await response.json(); //extract JSON from the http response

    var players = match["info"]["participants"]
    console.log(players)
    var playerResult;
    for (var p of players) {
        if (p["puuid"] == puuid) {
            console.log(p["summonerName"] + " victory is: " + p["win"])
            playerResult = p["win"];
            return playerResult;
        }
    }
    throw 'Error al buscar en la última partida';


}

function apiInit(summoner) {
    //var requestUrl = baseUrl + "/lol/summoner/v4/summoners/by-name/" + summonerName;
    //summoner = requestUrl;
    setSummonerName(summoner);
}