
var lastGameId = '0';

async function check() {
    var newId = await apiGetLastGameId();
    console.log(newId);
    if (lastGameId == "0") {
        lastGameId = newId;
        return false;
    }
    // Nuevo game detectado, se añade al buscador
    if (lastGameId.toString() === newId.toString())
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

// Rating Initialization
window.onload = async function () {
    apiInit();
    var changed = false;
    var modify;
    var id;
    //espera 30s
    //setTimeout(changed = check(), 30000);  
    while (true) {
        await sleep(3); // segundos
        changed = await check();
        if (changed) {
            changed = false;

            var result = await apiCheckLastResult();

            if (result) //result==true, win
                id = "wins";
            else id = "losses";

            modify = document.getElementById(id);
            var actual = parseInt(modify.innerHTML)
            actual = actual + 1;
            modify.innerHTML = actual;
        }
    }
};