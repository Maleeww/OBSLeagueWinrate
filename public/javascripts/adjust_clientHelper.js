//const { isQueueEmpty, consume } = require("../../javascripts/adjust_helper");


async function checkQueue(summonerName) {
    while(await queueSize(summonerName)>0)
    {
        let result = await consume(summonerName);
        switch(result){
            case(1): addWin();
            break;
            case(-1): addLoss();
            break;
            case(77): resetCounter();
            break;
            //default: break;
        }
    }
}

async function queueSize(name){
    return fetch('adjust/queueSize?name='+name, {
        method: 'get',                    
        redirect : 'follow',
        mode: 'cors' ,
        headers : new Headers({'Content-Type':'text/html'}),
        //body: JSON.stringify({'name': name})
    })
        .then(resultado => {return resultado.json()})
        .then(resultado => { console.log("QueueSize is: "+resultado); return resultado;}).catch((error) => errorDisplay())

}

async function consume(name){
    return fetch('adjust/consume?name='+name, {
        method: 'get',                    
        redirect : 'follow',
        mode: 'cors' ,
        headers : new Headers({'Content-Type':'text/html'}),
        //body: JSON.stringify({'name': name})
    })
        .then(resultado => {return resultado.json()})
        .then(resultado => { console.log(resultado); return resultado;}).catch((error) => errorDisplay())

}



