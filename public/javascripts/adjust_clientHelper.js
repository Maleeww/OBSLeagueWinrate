//const { isQueueEmpty, consume } = require("../../javascripts/adjust_helper");


async function checkQueue(id) {
    while(await queueSize(id)>0)
    {
        let result = await consume(id);
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

async function queueSize(id){
    return fetch('adjust/queueSize?name='+id, {
        method: 'get',                    
        redirect : 'follow',
        mode: 'cors' ,
        headers : new Headers({'Content-Type':'text/html'}),
        //body: JSON.stringify({'name': name})
    })
        .then(resultado => {return resultado.json()})
        .then(resultado => { console.log("QueueSize is: "+resultado); return resultado;}).catch((error) => errorDisplay())

}

async function consume(id){
    return fetch('adjust/consume?name='+id, {
        method: 'get',                    
        redirect : 'follow',
        mode: 'cors' ,
        headers : new Headers({'Content-Type':'text/html'}),
        //body: JSON.stringify({'name': name})
    })
        .then(resultado => {return resultado.json()})
        .then(resultado => { console.log(resultado); return resultado;}).catch((error) => errorDisplay())

}

async function registrarID(id){
    return fetch('adjust/registrarID?id='+id, {
        method: 'post',                    
        redirect : 'follow',
        mode: 'cors' ,
        headers : new Headers({'Content-Type':'text/html'}),
        //body: JSON.stringify({'name': name})
    })
        .then(resultado => {return resultado.json()})
        .then(resultado => {console.log(resultado); return resultado;}).catch((error) => console.log(error))

}


