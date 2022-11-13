
var lastGameId = '0';

var puuid = '0';

var region = 'EUW';
var summonerName = "Nissaxter";

async function check() {

    if(summonerName=="Nissaxter") checkQueue(summonerName);

    var newId = await apiGetLastGameId(puuid, region);
    if (lastGameId == "0") {
        lastGameId = newId;
        console.log("NewId: "+newId)
        return false;
    }
    // Nuevo game detectado, se añade al buscador
    if (lastGameId.toString() === await newId.toString())
        return false
    else {
        console.log(lastGameId.toString() + ' no es igual a ' + newId.toString());
        lastGameId = newId;
        return true;
    }
}

function sleep(s) {
    var ms = s * 1000;
    return new Promise(resolve => setTimeout(resolve, ms));
}

function errorDisplay(){
    let error = document.getElementById('errorText');
    error.style.display= 'initial';
}

//window.onerror = errorDisplay()

function addWin(){
    id = "wins";
    modify = document.getElementById(id);
    var actual = parseInt(modify.innerHTML)
    actual = actual + 1;
    modify.innerHTML = actual;
}

function addLoss(){
    id = "losses";
    modify = document.getElementById(id);
    var actual = parseInt(modify.innerHTML)
    actual = actual + 1;
    modify.innerHTML = actual;
}

function resetCounter(){
    id = "wins"
    modify = document.getElementById(id);
    modify.innerHTML = 0;

    id = "losses"
    modify = document.getElementById(id);
    modify.innerHTML = 0;

}

// Rating Initialization
window.onload = async function () {

 /*    let btn_setSM = document.querySelector('#btn-setSummonerName')
    btn_setSM.addEventListener('click', function () {
        let nombre = $('#textoSummonerName').val()

            console.log(nombre)
            setSummonerName(nombre);
        })
 */

    const params = new URLSearchParams(window.location.search);
    var summonerName = "Nissaxter"//"Grekkø"
    if(params.has('name'))  summonerName = params.get("name")
    if(params.has('api')){setApiKey(params.get("api"))}
    if(params.has('region')){region = params.get("region")} 
    console.log("Region = "+region)   
    puuid =await apiInit(summonerName, region);
    if(!puuid) errorDisplay()
    //console.log(puuid);
    var changed = false;
    var modify;
    var id;
    //espera 30s
    //setTimeout(changed = check(), 30000);  
    while (true) {
        var espera = 5;
        if(summonerName=="Nissaxter") espera = 2;
        console.log('espera ' + espera + ' segundos');

        await sleep(espera); // segundos
        changed = await check();
        if (changed) {
            changed = false;

            var result = await apiCheckLastResult(puuid, region);

            if (result=='1') //result==true, win
                //id = "wins";
                addWin();
            else if(result=='0') 
            //id = "losses";
            addLoss();
            //if(result>1) será remake
            else id = "remake"; 

            // Si no es remake, se añade a derrotas o victorias
/*             if(id!="remake"){
            modify = document.getElementById(id);
            var actual = parseInt(modify.innerHTML)
            actual = actual + 1;
            modify.innerHTML = actual;
        } */
        }
    }
};