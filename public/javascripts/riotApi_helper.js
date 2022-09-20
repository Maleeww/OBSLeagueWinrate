
// lose = 0
// win = 1
var apiKey = getApiKey();
//var lastGameIsWin = 1;
var aux = 1;
var region = "euw1";
const baseUrl = "https://" + region + ".api.riotgames.com";
var summoner;
var summonerName = "Grekkø" //"Grekkø";
//var puuid = "rfxaAA6AhqREAroXvZl3rP5i5_Mzuu5u6EkLYQxBPTE0MtPzhS0MhzmtAG0yxNcs7zwCbwCTFgiYVw";

function setRegion(newRegion) {
    region = newRegion;
    baseUrl = "https://" + newRegion + ".api.riotgames.com";
}

function setSummonerName(newName) {

        //let summonerName = $('#textoSummonerName').val()
        console.log(summonerName)
        
        fetch('api/setSummonerName', {
            method:'post',                    
            redirect : 'follow',
            mode: 'cors' ,
            headers : new Headers({'Content-Type':'application/json'}),
            body: JSON.stringify({'nombre': newName})})
            .then(resultado => {console.log(resultado)})
    
}

function setApiKey(newKey) {
    let key = $('#textoApiKey').val()
    console.log(key)

    fetch('api/setApiKey', {
        method:'post',                    
        redirect : 'follow',
        mode: 'cors',
        headers : new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({'api': key})})
        .then(resultado => {console.log(resultado);})
    console.log("Api key set to: "+apiKey)
}
 function apiGetLastGameId() {
    //let key = $('#textoApiKey').val()
    //console.log(key)

    return fetch('api/getLastGameId', {
        method:'get',                    
        redirect : 'follow',
        mode: 'cors' 
        //headers : new Headers({'Content-Type':'application/json'}),
        //body: JSON.stringify({'api': key})
    })
        .then(resultado => {return resultado.json()})
        .then(resultado => { console.log(resultado); return resultado;}).catch((error) => console.log(error))

}



async function apiCheckLastResult() {
    return fetch('api/apiCheckLastResult', {
        method:'get',                    
        redirect : 'follow',
        mode: 'cors' 
        //headers : new Headers({'Content-Type':'application/json'}),
        //body: JSON.stringify({'api': key})
    })  
    .then(resultado => {return resultado.json()})
    .then(resultado => { console.log(resultado); return resultado;}).catch((error) => console.log(error))


}

function apiInit(summoner) {
    return fetch('api/apiInit', {
        method:'post',                    
        redirect : 'follow',
        mode: 'cors',
        headers : new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({'summonerName': summoner})
    })
        
    .then(resultado => {return resultado.json()})
    .then(resultado => { console.log(resultado[0]); return resultado[0];}).catch((error) => console.log(error))

}

