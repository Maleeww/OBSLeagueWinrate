
var lastGameId = 0;

async function check() {
    var newId = apiGetLastGameId();
    if (lastGameId == 0) {
        lastGameId = newId;
        return false;
    }
    // Nuevo game detectado, se añade al buscador
    if (lastGameId != newId) {
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
    var changed = false;
    var modify;
    var id;
    //espera 30s
    //setTimeout(changed = check(), 30000);  
    while (true) {
        await sleep(15); // segundos
        changed = check();
        if (changed) {
            changed = false;

            var result = lastGameIsWin();

            if (result) //result==1, win
            id = "wins";
            else id = "losses";
            modify = document.getElementById(id);
            var actual = parseInt(modify.innerHTML)
            actual = actual+1;
            modify.innerHTML = actual;
        }
    }
};